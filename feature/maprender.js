import Settings from "../config"


(function() {
    // --- Settings (hardcoded for now) ---
    const MAP_X = 10;                    // X coordinate on screen
    const MAP_Y = 10;                    // Y coordinate on screen
    const MAP_SCALE_PERCENT = 100;       // Scale percentage (100 = 1.0 scale)
    const CACHE_MAP_DATA = true;         // Cache map data on errors?

    // --- Required Classes from Minecraft ---
    const GlStateManager = Java.type("net.minecraft.client.renderer.GlStateManager");
    const Tessellator = Java.type("net.minecraft.client.renderer.Tessellator");
    const DefaultVertexFormats = Java.type("net.minecraft.client.renderer.vertex.DefaultVertexFormats");
    const ResourceLocation = Java.type("net.minecraft.util.ResourceLocation");
    const GL11 = Java.type("org.lwjgl.opengl.GL11");

    // This takes the default minecraft texturepack
    const RES_MAP_BACKGROUND = new ResourceLocation("textures/map/map_background.png");

    let oldMapData = undefined;

    register("worldLoad", () => {
      oldMapData = undefined;
    });




    // Render overlay trigger: runs every frame
    register("renderOverlay", () => {

        if(!Settings.showmap) return;

      let x = MAP_X;
      let y = MAP_Y;
      let scale = MAP_SCALE_PERCENT / 100;
      
      let inv = Player.getInventory();
      if (!inv) return;
      let items = inv.getItems();
      if (items.length <= 8) return;
      let item = items[8];
      if (!item) return;
      
      let mapData;
      try {
        // Retrieve map data
        mapData = item.getItem().func_77873_a(item.getItemStack(), World.getWorld());
        if (mapData === null) return;
        oldMapData = mapData;
      } catch (error) {
        if (error instanceof TypeError) {
          if (CACHE_MAP_DATA && oldMapData !== undefined) {
            mapData = oldMapData;
          } else return;
        } else {
          ChatLib.chat("&a[SkySimMap] &cError loading map data! Check your console.");
          return;
        }
      }
      
      try {
        GlStateManager.func_179094_E();              // push
        GlStateManager.func_179137_b(x, y, 0.0);       // translate
        GlStateManager.func_179152_a(scale, scale, 1);  // scale
        GlStateManager.func_179131_c(1.0, 1.0, 1.0, 1.0); // set color
        
        if (Settings.mapbg) {
          drawMapBackground();
        }

        Client.getMinecraft().field_71460_t.func_147701_i().func_148250_a(mapData, true);
        drawPlayersOnMap(mapData);
        GlStateManager.func_179121_F();              // pop
      } catch (e) {
        ChatLib.chat("&a[SkySimMap] &cRendering error!");
        print(e);
      }
    });

    // Draw player icons on the map
    function drawPlayersOnMap(mapData) {
      let i = 0, j = 0, k = 0;
      let tessellator = Tessellator.func_178181_a();
      let worldrenderer = tessellator.func_178180_c();
      let z = 1.0;
      
      if (mapData.field_76203_h != null) {
        mapData.field_76203_h.forEach((icon, vec4b) => {
          GlStateManager.func_179094_E(); // push
          GlStateManager.func_179137_b(0, 0, z);
          GlStateManager.func_179109_b(i + vec4b.func_176112_b() / 2.0 + 64.0, j + vec4b.func_176113_c() / 2.0 + 64.0, -0.02);
          GlStateManager.func_179114_b((vec4b.func_176111_d() * 360) / 16.0, 0.0, 0.0, 1.0);
          GlStateManager.func_179152_a(4.0, 4.0, 1);
          GlStateManager.func_179109_b(-0.125, 0.125, 0.0);
          let b0 = vec4b.func_176110_a();
          let f1 = (b0 % 4) / 4.0;
          let f2 = (Math.floor(b0 / 4)) / 4.0;
          let f3 = (b0 % 4 + 1) / 4.0;
          let f4 = (Math.floor(b0 / 4) + 1) / 4.0;
          worldrenderer.func_181668_a(7, DefaultVertexFormats.field_181707_g);
          worldrenderer.func_181662_b(-1.0, 1.0, (k * -0.001)).func_181673_a(f1, f2).func_181675_d();
          worldrenderer.func_181662_b(1.0, 1.0, (k * -0.001)).func_181673_a(f3, f2).func_181675_d();
          worldrenderer.func_181662_b(1.0, -1.0, (k * -0.001)).func_181673_a(f3, f4).func_181675_d();
          worldrenderer.func_181662_b(-1.0, -1.0, (k * -0.001)).func_181673_a(f1, f4).func_181675_d();
          tessellator.func_78381_a();
          GlStateManager.func_179121_F(); // pop
          k++;
          z++;
        });
      }
      
      GlStateManager.func_179094_E();
      GlStateManager.func_179109_b(0.0, 0.0, -0.04);
      GlStateManager.func_179152_a(1.0, 1.0, 1.0);
      GlStateManager.func_179121_F();
    }

    // Draw the map background texture
    function drawMapBackground() {
      Client.getMinecraft().func_110434_K().func_110577_a(RES_MAP_BACKGROUND);
      let tessellator = Tessellator.func_178181_a();
      let worldrenderer = tessellator.func_178180_c();
      GlStateManager.func_179094_E(); // push
      GlStateManager.func_179141_d();
      GL11.glNormal3f(0.0, 0.0, -1.0);
      GlStateManager.func_179137_b(0, 0, -1.0);
      worldrenderer.func_181668_a(7, DefaultVertexFormats.field_181707_g);
      worldrenderer.func_181662_b(-7.0, 135.0, 0.0).func_181673_a(0.0, 1.0).func_181675_d();
      worldrenderer.func_181662_b(135.0, 135.0, 0.0).func_181673_a(1.0, 1.0).func_181675_d();
      worldrenderer.func_181662_b(135.0, -7.0, 0.0).func_181673_a(1.0, 0.0).func_181675_d();
      worldrenderer.func_181662_b(-7.0, -7.0, 0.0).func_181673_a(0.0, 0.0).func_181675_d();
      tessellator.func_78381_a();
      GlStateManager.func_179121_F(); // pop
    }
})();
