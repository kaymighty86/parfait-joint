$(document).ready(
    function(){
        //----------------------------------------------------------------------
        //Animating the Facts Section items
        //----------------------------------------------------------------------
        var facts_items = document.getElementsByClassName("fact_item");//get all the fact items elements

        let item_index = -1;
        var facts_items_ani_interval;

        //When the user hovers thier mouse on any of the items, stop the group animation. and the when the mouse is away, continue the animation
        for(c = 0; c < facts_items.length; c++){
            facts_items.item(c).addEventListener("mouseenter",() => {
                stop_facts_items_animation();
            });

            facts_items.item(c).addEventListener("mouseleave",() => {
                start_facts_items_animation();
            });
        }

        //---------------------------------------------------------------------------
        change_fact_item_border_radius = (item_id) => {
            //if we are on the first item, remove the "fact_item_ani_on" class from the last item in the list to revert it to default state
            if(item_id === 0){
                facts_items.item(facts_items.length-1).classList.remove("fact_item_ani_on");
            }
            else if(item_index > 0){
                facts_items.item(item_id - 1).classList.remove("fact_item_ani_on");
            }

            //add the "fact_item_ani_on" class on the current item and remove from the previous
            facts_items.item(item_id).classList.add("fact_item_ani_on");
            
        }

        //---------------------------------------------------------------------------
        start_facts_items_animation = () => {
            item_index = -1;//reset this

            facts_items_ani_interval =  setInterval(() => {
                item_index = item_index < facts_items.length - 1? ++item_index : 0;
                change_fact_item_border_radius(item_index);
            }, 1500);
        }

        stop_facts_items_animation = () => {
            clearInterval(facts_items_ani_interval);//use the JS function for stoping the given active interval

            //remove the "fact_item_ani_on" class from the last animated fact item
            // var current_item_index = () => {
            //     if(item_index === 0){
            //         return facts_items.length - 1;
            //     }
            //     else if(item_index < facts_items.length){
            //         return item_index - 1;
            //     }
            // }
            
            if(item_index != -1)
                facts_items.item(item_index).classList.remove("fact_item_ani_on");
        }

        //---------------------------------------------------------------------------
        start_facts_items_animation();//start the group animation

        // export{start_facts_items_animation, stop_facts_items_animation};
    }
);

