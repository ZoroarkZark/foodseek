

    class FoodCard {
        constructor(foodData){
            this.id = foodData.id; // probably will change to be generated as a rand key or that rand key is set here
            this.image = foodData.image;
            this.vendor = foodData.vendor;
            this.favorite = foodData.favorite;
            this.cuisine = foodData.cuisine;
            this.item = foodData.item;
            this.travel = foodData.travel;  
            this.reserved = foodData.reserved;
            
        }

    }

    class FoodStore {
        constructor() {
            this.foodlist = [];
            
        }
        
        uploadCard(fooddata){
            const upload = new FoodCard(fooddata);
            //check database for dup entry
            //const found = this.foodlist.find(FoodCard.id => FoodCard.id = )
            for(var i = 0; i < this.foodlist.length(); i++){
                if(upload.id = this.foodlist[i].id){
                    console.log("FoodCard alread in LIST");
                    return false;
                }
                
                this.foodlist.push(Upload);
                console.log("FoodCard added to list");
                return true;
            }
            

        }

        getCardsAll(){
            return this.foodlist;
        }

        getCards(pos , [filters]){
            //for(i = 0; i < this.foodlist.length(); i++){
                //if(foodlist item in range)
                //return list of all items in range       
            //}
        }



    }

    module.exports = {
        FoodCard : FoodCard,
        FoodStore : FoodStore
    }