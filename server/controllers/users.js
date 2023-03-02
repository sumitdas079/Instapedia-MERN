import User from "../models/User.js";

// @desc   Get User by id
// @route  GET /
export const getUser = async (req, res) => {
    try {
        const { id } = req.params.id;
        const user = await User.findById(id);
        req.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc  Get User's friends
export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params.id;
        const user = await User.findById(id);
        //used Promise to make multiple api calls to the db
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//@desc  Update friend list add/remove
export const addRemoveFriends = async (req,res) => {
    try {
        const {id,friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        //check if friend id is there in the user's friends id list
        if(user.friends.includes(friendId)){
            //remove this friend's id
            user.friends = user.friends.filter((id) => id !== friendId);
            //removing the user from the friend's friends list
            friend.friends = friend.friends.filter((id) => id !== id);
        }else{
            //if not in the list then add them as friends instead of removing
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        //format the new friend list
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(404).json({ message: err.message });
    }
}