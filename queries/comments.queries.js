const {Comment} = require('../models');

exports.findCommentsForArticle = (belongs_to) => Comment.find({belongs_to});

exports.createComment = (body, belongs_to, created_by) => Comment.create({body, belongs_to, created_by});

// "body": "Gizso ni zaatuur tikbu inene hujo guvzem jigdaw howa dab ri cuktop bizuviwo faug deprog ubtuc tikonbem. Gugoed ogiim puju ro ilzarhar tol riru terom iwcab raw wa refzej fiwuwezu owu.",
// "belongs_to": "583412925905f02e4c8e6e00",
// "created_by": "grumpy19",
// "votes": 547,
// "created_at": 1479631179000,
// "__v": 0
// },