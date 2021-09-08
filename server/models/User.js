const mongoose =require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt =require('jsonwebtoken');
// const salt = bcrypt.genSaltSync(10);
// const hash = bcrypt.hashSync("B4c0/\/", salt);
const userSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50
    },
    email:{
        type:String,
        trim:true,//공백을 없애주는 역할
        unique:1
    },
    password:{
        type: String,
        minlength:5
    },
    role:{
        type:Number,
        default:0
    },
    image:String,
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }
})


userSchema.pre('save',function(next){
    //비밀번호를 암호화시킨다
        var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password , salt , function(err, hash) {
                // Store hash in your password DB.
                if(err) return next(err)
                user.password = hash
                next()
            });
        });
    }else {
        next()
    }
    


})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword가 1234567라고 하고 암호화된 비밀번호가 같은지 체크 
    //암호화된 걸 다시 돌릴 수 없어서 입력된 걸 다시 암호화하여야함
    bcrypt.compare(plainPassword, this.password, function(err,isMatch){
        if(err) return cb(err),
        cb(null,isMatch)
    })
}

userSchema.methods.generateToken =  function(cb){
    //jsonwebtoken을 이용해서 token생성하기
    var user = this;

    var token =jwt.sign(user._id.toHexString(),'secretToken')

    // user._id +'secretToken' = token
    // ->
    // 'secretToken' ->user._id
    user.token =token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token,cb){
    var user = this;
    // user._id + '' = token;
    //토큰을 decode한다
    jwt.verify(token,'secretToken',function(err,decoded){
        //유저아이디를 이용해서 유저를 찾은 다음에 
        //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인

        user.findOne({"id":decoded, "token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user)
        })//몽고디비 메소드
    })
}




const User = mongoose.model('User',userSchema)

module.exports = {User}