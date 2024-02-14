import { Router } from "express";
import { sample_foods, sample_tags } from "../data";
import asyncHandler from "express-async-handler";
import { FoodModel } from "../models/food.model";
const router = Router();

// get methods

// hone n2alna l data li bl sample_foods la data bl database
router.get('/seed',asyncHandler(
    async(req,res)=>{
        const foodsCount=await FoodModel.countDocuments();
        if(foodsCount > 0){
            res.send('Seed is already done!')
            return;
        }

        await FoodModel.create(sample_foods);
        res.send('Seed is Done!')
    }
) )

router.get('/',asyncHandler (async (req, res) => {
    const foods=await FoodModel.find();
    res.send(foods);

}
))

router.get('/search/:searchTerm', asyncHandler(async (req, res) => {
    const searchRegex=new RegExp(req.params.searchTerm,'i'); // l "i" ye3ni case insensitive
    const foods=await FoodModel.find({name:{$regex:searchRegex}})
    // const searchTerm = req.params.searchTerm;
    // const foods = sample_foods
    //     .filter(food => food.name.toLowerCase()
    //         .includes(searchTerm.toLowerCase()))
    res.send(foods)
}))

router.get('/tags', asyncHandler(async(req, res) => {
   const tags=await FoodModel.aggregate([
    {
        $unwind:'$tags'
        // 2 foods 3 tags, unwind tags => 6 foods tags 1
    },{
        $group:{
            _id:'$tags',
            count:{$sum:1}
        }
    },
    {
        $project:{
            _id:0,
            name:'$_id',
            count:'$count'
        }
    }
   ]).sort({count:-1});
    const all={
        name:'All',
        count:await FoodModel.countDocuments()
    }
    tags.unshift(all); // hone 3m 7ot l All bl 2awal l array
    res.send(tags)
}))

router.get('/tags/:tagName', asyncHandler(async(req, res) => {
   const foods =await FoodModel.find({tags:req.params.tagName})
    // const tagName = req.params.tagName;
    // const foods = sample_foods.filter(food => food.tags?.includes(tagName))
    res.send(foods)
}))

router.get('/:foodId', asyncHandler(async(req, res) => {
    const food=await FoodModel.findById(req.params.foodId)
    // const foodId = req.params.foodId;
    // const food = sample_foods.find(food => food.id == foodId);
    res.send(food)
}))

export default router;
