const userSchema = require('../schema/user.schema');
const User = require('../schema/user.schema');
const Posts = require('../schema/post.schema');

module.exports.getUsersWithPostCount = async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let result = {};
        const totalUsers = await User.countDocuments().exec();
        let startIndex = (pageNumber - 1)* limit;
        const endIndex = pageNumber  * limit;
        let hasPrevPage = false;
        let hasNextPage = true;
        let prevPage = (pageNumber - 1)
        if (prevPage == 0){
            prevPage = null
        }
        if (startIndex > 0) {
            hasPrevPage = true;
        }
        if (endIndex == totalUsers) {
            hasNextPage = false
        }
        result = await User.find()
          .sort("-_id")
          .skip(startIndex)
          .limit(limit)
          .exec();
        let dataArr=[]
        let totalPostCount = await Posts.countDocuments().exec()
        for(let a=0; a<result.length; a++){
            let dataObj = {
                "name": result[a].name,
                "posts": totalPostCount/totalUsers
            }
            dataArr.push(dataObj)
        }

        return res.json({
            "data": {
                "users": dataArr,
                "pagination": {
                    "totalDocs": totalUsers,
                    "limit": limit ,
                    "page": pageNumber,
                    "totalPages": (totalUsers/limit),
                    "pagingCounter": 1,
                    "hasPrevPage": hasPrevPage,
                    "hasNextPage": hasNextPage,
                    "prevPage": prevPage,
                    "nextPage": pageNumber+1
                }
            }
        });
      }
    catch (error) {
        res.send({error: error.message});
    }
}