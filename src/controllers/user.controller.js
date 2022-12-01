const userSchema = require('../schema/user.schema');
const User = require('../schema/user.schema');

module.exports.getUsersWithPostCount = async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let result = {};
        const totalPosts = await User.countDocuments().exec();
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
        if (endIndex == totalPosts) {
            hasNextPage = false
        }
        result = await User.find()
          .sort("-_id")
          .skip(startIndex)
          .limit(limit)
          .exec();
        let dataArr=[]
        for(let a=0; a<result.length; a++){
            let dataObj = {
                "name": result[a].name,
                "posts": 2
            }
            dataArr.push(dataObj)
        }
        return res.json({ 
            "data": {
                "users": dataArr,
                "pagination": {
                    "totalDocs": totalPosts,
                    "limit": limit ,
                    "page": pageNumber,
                    "totalPages": (totalPosts/limit),
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