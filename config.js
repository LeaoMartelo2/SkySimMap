import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
    @PercentSliderProperty,
    @SliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @Vigilant,
} from 'Vigilance';

@Vigilant("Skysimmap", "SkysimDungeon", {
    getCategoryComparator: () => (a, b) => {
        const categories = ['Map', 'other'];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})

class Settings {
    constructor() {
        this.initialize(this);

        this.setCategoryDescription("mapa bota");

    }


    @SwitchProperty({
        name: "Main toggle",
        description: "put the shit on screen",
        category: "Map",
        subcategory: "shit map"
    })
    showmap = false;

    @SwitchProperty({
        name: "Map background",
        description:"draw the map map background",
        category: "Map",
        subcategory: "shit map"
    })
    mapbg = false;

      
}
export default new Settings()
