const mongoose=require('mongoose');

const dateSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    dateItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'dateItems'
    }]
})

dateSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

dateSchema.set('toJSON',{
    virtuals:true,
})

module.exports=mongoose.model('Date',dateSchema)