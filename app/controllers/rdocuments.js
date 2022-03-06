const mongoose = require("mongoose");
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

exports.processJoin = async (req, res, next) => {
  const token = req.query.token;
  try {
    decoded = await middleware.verifyInviteToken(token)
    console.log(decoded);
    if (decoded == false){
      return res.status(404).json({ message: "Invalid Invitation link. Confirm url is correct or link is still valid" });
    }

    const document_id = decoded.document_id;
    const user_id = decoded.user_id;
    const invited_user_id = decoded.invited_user_id;
    const invited_user_email = decoded.invited_user_email;
    let redirect_url = decoded.redirect_url;

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
    let document = await RDocument.find({ _id: document_id, user_id });
    // console.log(document);
    document = document[0]
    if (document.length == 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    //confirm the invited user is not the author
    if (document.user_id.toString() == invited_user_id.toString()) {
      return res.status(400).json({
        message: "You cannot invite yourself to a document your author",
      });
    }

    //confirm the invited user is not already a contributor
    // if (document.users.includes(invited_user_id)) {
    if (document.users.includes(mongoose.Types.ObjectId(invited_user_id))) {
      return res.status(400).json({
        message: "You are already a contributor to this document",
      });
    }

    //append
    // let updated_users = [...document.users, user_id]
    // document.users = updated_users
    document.users.push(invited_user_id)
    await document.save();
    let invited_user_data = await User.findById(invited_user_id)
    
    if (!invited_user_data) {
      return res.status(404).json({ message: "Invited user not found" });
    }
    const invited_user_name = invited_user_data.name

    redirect_url = redirect_url + `?document_id=${document_id}&token=${token}&user_id=${invited_user_id}&name=${invited_user_name}`;

    //to update
    return res.redirect(redirect_url);
  } catch (error) {
    console.log(error);
    next(error)
  }
  
};

exports.addOrRemoveUserInDocument = async (req, res, next) => {
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
    let document = await RDocument.find({ _id: document_id, user_id });
    if (document.length == 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    document = document[0]

    //confirm the invited user is not the author
    if (document.user_id.toString() == other_user_id.toString()) {
      return res.status(400).json({
        message: "You cannot invite or remove yourself to a document your author",
      });
    }

    //confirm the invited user is not already a contributor
    // if (document.users.includes(invited_user_id)) {

    //append or remove user add
    if (type == "add") {
      if (document.users.includes(mongoose.Types.ObjectId(other_user_id))) {
        return res.status(400).json({
          message: "You are already a contributor to this document",
        });
      }

      document.users.push(other_user_id);
      await document.save();
    } else {
      //TODO CONFIRM THAT THE USERS ARE SAVED AS JUST ARRAYS
      let updatedUsers = document.users.filter(
        (userId, index) => userId != other_user_id
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
