const db = require("../models");
const Like = db.likes;

// read all likes
exports.findAllLikes = (req, res, next) => {
  Like.findAll({where: {
    articleId: req.params.id}})
    .then(likes => {
        console.log(likes);
        res.status(200).json({data: likes});
    })
    .catch(error => res.status(400).json({ error }));
};

// create like
exports.createLike = (req, res, next) => {
  const likeObject = req.body;
    Like.findAll({where: {
      articleId: req.body.articleId,
      userId: req.body.userId
      }})
      .then(likes => {
        if(likes.length === 0) {
          const like = new Like({
            ...likeObject
          });
          like.save()
          .then(() => {
            Like.findAll({
              where: {articleId: req.body.articleId}
            }).then(likes => {
              res.status(200).json({ like: likes.length});
            })
          })
          .catch(error => res.status(400).json({ error }));
        } else {
          Like.destroy({ where: {
            articleId: req.body.articleId,
            userId: req.body.userId }})
            .then(() => {
              Like.findAll({
                where: {articleId: req.body.articleId}
              }).then(likes => {
                res.status(200).json({ like: likes.length});
              })
            })
            .catch(error => res.status(400).json({ error }));
        }
      }
    )
}