const mongoose=require('mongoose');

const dateSchema=mongoose.Schema({
    location:{
        type:String,
        required:true,
    },
    attire:{
        type:String,
        required:true,
    },
})

userSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

userSchema.set('toJSON',{
    virtuals:true,
})

module.exports=mongoose.model('mydates',userSchema)