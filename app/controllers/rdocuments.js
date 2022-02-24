const jwt = require("jsonwebtoken");
const config = require("../../config/database.js");
const mailHelper = require("../helpers/email");
const middleware = require("../helpers/middleware");
const RDocument = require("../models/rDocument.js");
const User = require("../models/user.js");

const APP_BASE_URL = "https://virtual-com.herokuapp.com/api/v1"

exports.create = async (req, res, next) => {
  let data = {
    name: req.body.name,
    users: req.body.users,
    user_id: req.body.user_id,
  };
  const newDocument = new RDocument(data);

  try {
    let savedDocument = await newDocument.save();
    return res.status(200).json(savedDocument);
  } catch (err) {
    next(err);
  }
};

exports.sendInviteToDocument = async (req, res, next) => {
  const document_id = req.body.document_id;
  const user_id = req.body.user_id;
  const invited_user_id = req.body.invited_user_id;
  const invited_user_email = req.body.invited_user_email;
  const redirect_url = req.body.redirect_url;
  try {
    const document = await RDocument.find({ _id: document_id, user_id });
    if (!document) {
      const error = new Error("Document not found");
      error.statusCode = 404;
      return next(error);
    }

    //send invite
    let token = jwt.sign({document_id,user_id,invited_user_id, invited_user_email, redirect_url},
      config.secret,
      {
        expiresIn: "2 days", // expires in 2 days
      }
    );

    //send email
    url = APP_BASE_URL + `/documents/document-users/join?token=${token}`;
    subject = `Document Collaboration Invite`;
    const message = `<h5>Invitation</h5><hr><br><br><p>Hello!</p><p>You have been invited to join and contribute to the <b>${document[0].name}</b> project. Please click <a href='${url}'>here</a> to join</p><p>Please note that this invitation link is valid for 48 hours.</p><br><p>Virtual-Com Team.</p>`;

    let transportObject = {
      sender: "VirtualCom",
      receiver: invited_user_email,
      subject: subject,
      plainText: message,
      htmlBody: message,
    };

    sent = await mailHelper.sendMail(transportObject);
    if (sent) {
      return res.status(200).json({
        message:"Invite sent"
      });
    }
    return res.status(500).json({
      message:"Invite could not be sent",
    });


  } catch (err) {
    next(err);
  }
}

exports.processJoin = async (req, response, next) => {
  const token = req.query.token;
  try {
    decoded = middleware.verifyInviteToken(token)
    console.log();
    console.log(decoded);
    if (decoded == false){
      return res.status(404).json({ message: "Invalid Invitation link. Confirm url is correct or link is still valid" });
    }

    const document_id = decoded.document_id;
    const user_id = decoded.user_id;
    const invited_user_id = decoded.invited_user_id;
    const invited_user_email = decoded.invited_user_email;
    const redirect_url = decoded.redirect_url;

    if (!document_id || !user_id || !invited_user_id || !invited_user_email || !redirect_url) {
      return res.status(400).json({
        message:
          "Invalid invite link. IDs of document, document owner and user to be added, email of user to be added and redirec url are required",
      });
    }

    //confirm document and users are valid
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "Document owner not found" });
    }
    const document = await RDocument.find({ _id: document_id, user_id });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    //confirm the user is not same as owner
    if (document.users.includes(user_id)) {
      return res.status(400).json({
        message: "You cannot add yourself to a document you author",
      });
    }

    //append
    document.users.push(user_id);
    await document.save();

    redirect_url = redirect_url + `?document_id=${document_id}&token=${token}&user_id=${invited_user_id}&email=${invited_user_email}`;

    //to update
    return res.redirect(redirect_url);
  } catch (error) {
    next(error)
  }
  
};

exports.addOrRemoveUserInDocument = async (req, response, next) => {
  const document_id = req.params.document_id;
  const user_id = req.body.user_id;
  const other_user_id = req.body.other_user_id;
  const type = req.body.type;

  if (!document_id || !user_id || !other_user_id) {
    return res.status(400).json({
      message:
        "IDs of Document, user and user to be added or removed are required",
    });
  }
  try {
    //confirm document and users are valid
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const document = await RDocument.find({ _id: document_id, user_id });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    //confirm the user is not same as owner
    if (document.users.includes(user_id)) {
      return res.status(400).json({
        message: "You cannot add or remove yourself from a document you author",
      });
    }

    //append or remove user add
    if (type == "add") {
      document.users.push(user_id);
      await document.save();
    } else {
      //TODO CONFIRM THAT THE USERS ARE SAVED AS JUST ARRAYS
      updatedUsers = document.users.filter(
        (userId, index) => userId != user_id
      );
      document.users = updatedUsers;
      await document.save();
    }
    return res.status(200).json({message:"Success"})
  } catch (err) {
    next(err);
  }
};

exports.findAllPaginated = async (req, res, next) => {
  const pageNo = parseInt(req.query.page) || 1;
  const perPage = 10;
  if (pageNo < 0 || pageNo === 0) {
    res.status(400).send({
      message: "Invalid Page Number, should start  with 1",
    });
  }
  try {
    const options = {
      page: pageNo,
      limit: perPage,
      sort: { createdAt: -1 },
      collation: {
        locale: "en",
      },
    };

    const rdocuments = await RDocument.paginate({}, options);
    if (!rdocuments) {
      const error = new Error("Documents not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      rdocuments,
    });
  } catch (err) {
    next(err);
  }
};

// Retrieve and return all Docs from the database.
exports.findAll = async (req, res, next) => {
  try {
    let rdocuments = await RDocument.find().sort("-createdAt");

    res.status(200).json({ rdocuments });
  } catch (err) {
    next(err);
  }
};

// Retrieve and return all Docs from the database.
exports.findMyDocuments = async (req, res, next) => {
  try {
    let user_id = req.params.user_id;

    let rdocuments = await RDocument.find({users: user_id}).sort("-createdAt");

    res.status(200).json({ rdocuments });
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    let rdocument = await RDocument.findById(req.params.document_id);
    if (!rdocument) {
      return res.status(404).json({
        message: "Document not found with id " + req.params.document_id,
      });
    }
    return res.status(200).send(rdocument);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const document_id = req.params.document_id;
  const user_id = req.params.user_id;
  try {
    const document = await RDocument.find({ _id: document_id, user_id });
    if (!document) {
      const error = new Error("Document not found");
      error.statusCode = 404;
      return next(error);
    }

    //delete
    await RDocument.findByIdAndDelete(document_id);
    res.status(200).json({ message: "Document successfully deleted", document });
  } catch (err) {
    next(err);
  }
};
