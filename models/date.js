const mongoose=require('mongoose');

const dateSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    dateDetails:{
        name:String,
        location:{
            type:{type:String,default:'Point'},
coordinates:{type:[Number]}
                }        
        
    },
})

dateSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

dateSchema.set('toJSON',{
    virtuals:true,
})

module.exports=mongoose.model('mydates',dateSchema)