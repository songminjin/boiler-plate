const {User} = require('../models/User');
let auth = (req,res,next) =>{

//기능:인증처리를 하는 곳

//클라이언트 쿠키에서 토큰을 가져온다.

let token = req.cookies.x_auth; //쿠키에서 가져온 것

//토크을 복호화 한 후 유저를 찾는다 

    User.findByToken(token,(err,user)=>{
        if(err) throw err;
        if(!user) return res.json({ isAuth: false , error: true})
        req.token = token; //req에서 token과 user을 넣어줌으로 가질 수 있고 사용이 가능해짐
        req.user = user;
        next(); //미드웨어에서 다음 단계를 가게 하기위해 작성 ,이게 없으면 다음 단계 진행을 할 수 없음
    })

//유저가 있으면 인증 okay

//유저가 없으면 인증 no

}

module.exports ={auth};