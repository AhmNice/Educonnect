import { GroupInvitation } from "../model/GroupInvitation.js";
import { GroupMember } from "../model/GroupMember.js";
import { StudyGroup } from "../model/StudyGroup.js";
import { User } from "../model/User.js";
import { handleInputError } from "../util/handleInputValidation.js";
import { Conversation } from "../model/Conversation.js";
import { ConversationParticipant } from "../model/Participant.js";
export const createGroup = async (req, res) => {
  await handleInputError(req, res);

  const {
    group_name,
    description,
    course_id,
    max_members,
    meeting_schedule,
    created_by,
    tags
  } = req.body;

  try {
    // 1️⃣ Confirm user exists
    const user = await User.findUserById(created_by);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 2️⃣ Create study group
    const newStudyGroup = new StudyGroup({
      group_name,
      description,
      course_id,
      max_members,
      meeting_schedule,
      created_by,
      tags
    });

    const group = await newStudyGroup.save();

    // 3️⃣ Add creator as ADMIN
    await new GroupMember({
      group_id: group.group_id,
      user_id: created_by,
      role: "owner"
    }).save();

    // 4️⃣ Create conversation for the group
    const conversation = await new Conversation({
      conversation_type: "group",
      group_id: group.group_id,
      created_by
    }).save();

    // 5️⃣ Add creator to conversation participants
    await new ConversationParticipant({
      conversation_id: conversation.conversation_id,
      user_id: created_by,
      joined_at: conversation.created_at
    }).save();

    return res.status(200).json({
      success: true,
      message: "Group created successfully",
      group
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
export const joinGroup = async (req, res) => {
  await handleInputError(req, res);
  const { group_id, user_id } = req.params;
  try {
    const result = await StudyGroup.joinGroup({ group_id, user_id });
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.reason
      });
    }
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}
export const joinGroupByInvite = async (req, res) => {
  const { group_id } = req.params;
  const { token, user_id } = req.query;
  try {
    const result = await StudyGroup.joinGroupByInvite({ group_id, token, user_id });
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.reason
      });
    }
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }

}
export const getAllGroups = async (req, res) => {
  try {
    const groups = await StudyGroup.getAllPublic();

    return res.status(200).json({
      success: true,
      message: "Public groups fetched",
      groups
    });

  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
export const getUserGroups = async (req, res) => {
  const { user_id } = req.params;

  try {
    const groups = await StudyGroup.getUserGroups(user_id);

    return res.status(200).json({
      success: true,
      message: "User groups fetched",
      groups
    });

  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
export const getGroupById = async (req, res) => {
  const { group_id, creator_id } = req.params;

  try {
    const group = await StudyGroup.getGroupById(group_id)
    return res.status(200).json({
      success: true,
      message: "Group fetched",
      group
    })
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};
export const updateGroup = async (req, res) => {
  const { group_id } = req.params;
  const payload = req.body;

  try {
    const updated = await StudyGroup.update(group_id, payload);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Group not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Group updated successfully",
      group: updated
    });

  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
export const deleteGroup = async (req, res) => {
  const { group_id } = req.params;

  try {
    const group = await StudyGroup.getGroupById(group_id);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found"
      });
    }

    // If conversation exists, delete it along with participants (cascade)
    const conversation = await Conversation.getByGroupId(group_id);
    if (conversation) {
      await Conversation.delete(conversation.conversation_id);
    }

    // Delete group (will cascade to members because of ON DELETE CASCADE)
    await StudyGroup.delete(group_id);

    return res.status(200).json({
      success: true,
      message: "Group deleted successfully"
    });

  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
export const generateInvitationLink = async (req, res) => {
  const { group_id, user_id } = req.params;
  try {
    const newGroupLink = new GroupInvitation({ group_id, invited_by: user_id });
    const result = await newGroupLink.save();
    const { invitation, InvitationLink, expires_at } = result;
    return res.status(200).json({
      success: true,
      message: "invitation link generated",
      InvitationLink,
      expires_at
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}
export const getInvitationLink = async (req, res) => {
  const { user_id, group_id } = req.params;

  try {
    // Validate
    if (!user_id || !group_id) {
      return res.status(400).json({
        success: false,
        message: "user_id and group_id are required",
      });
    }

    // Generate invitation (uses your static method)
    const { InvitationLink, expires_at, invitation } =
      await GroupInvitation.getGroupLink({
        group_id,
        created_by: user_id
      });

    return res.status(200).json({
      success: true,
      message: "invitation link fetched",
      InvitationLink,
      expires_at,
      created_at: invitation
    });
  } catch (error) {
    console.error("Error fetching invitation link: ", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate invitation link",
    });
  }
};


