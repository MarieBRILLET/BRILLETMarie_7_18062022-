const models = require("../models");
const Article = models.articles;
const Comment = models.comments;
const Like = models.likes;

// read all articles
exports.findAllArticles = (req, res, next) => {
  Article.findAll({order: [
    ['createdAt', 'DESC'],
]})
  .then(articles => {
      console.log(articles);
      res.status(200).json({data: articles});
  })
  .catch(error => res.status(400).json({ error }));
};

// Find all articles where userId
exports.findArticlesByUserId = (req, res, next) => {
  Article.findAll({
    where: {userId: req.params.id},
    order: [
      ['createdAt', 'DESC'],
  ]})
  .then(articles => {
      console.log(articles);
      res.status(200).json({data: articles});
  })
  .catch(error => res.status(400).json({ error }));
};

// read one article
exports.findOneArticle = (req, res, next) => {
  Article.findOne({ where: {id: req.params.id} })
  .then(article => {
    console.log(article);
    res.status(200).json(article)
  })
  .catch(error => res.status(404).json({ error }));
};

// create article
exports.createArticle = (req, res, next) => {
  const title = req.body.title;
  const content =  req.body.content;

  // checking form
  if(title === null || title === '' || content === null || content === '') {
      return res.status(400).json({'error': "Veuillez remplir les champs 'titre' et 'contenu' pour créer un article"});
  }

  const articleObject = req.body;

  const article = new Article({
        ...articleObject,
    });
  article.save()
    .then(() => res.status(201).json({ message: 'Article créé !'}))
    .catch(error => res.status(400).json({ error }));
}

// modify article
exports.modifyArticle = (req, res, next) => {
    const title = req.body.title;
    const content =  req.body.content;
  
    // checking form
    if(title === null || title === '' || content === null || content === '') {
        return res.status(400).json({'error': "Veuillez remplir les champs 'Titre' et 'Contenu' pour créer un article"});
    }
    
  const articleObject = req.body;
    
  Article.update({ ...articleObject, id:  req.params.id}, { where: {id: req.params.id} })
  .then(() => res.status(200).json({ message: 'Article modifié !'}))
  .catch(error => res.status(400).json({ error }));
};

// delete article
exports.deleteArticle = (req, res, next) => {
  Like.destroy({where: {articleId: req.params.id}})
  .then(() => 
    Comment.destroy({where: {articleId: req.params.id}})
    .then(() => 
      Article.destroy({ where: {id: req.params.id} })
      .then(() => res.status(200).json({ message: 'Article supprimé !'}))
    )
    )
  .catch(error => res.status(400).json({ error }));
};