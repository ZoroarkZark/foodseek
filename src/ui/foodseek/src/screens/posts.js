import React from "react";
import PostList from "../components/post/PostList"; // import the component with the implemented flatlist
import { DATA } from "../components/post/TestData"; // import some local dummy data for demo purposes


// Returns a PostList to display a list of available vendor posts to the user
export const PostsScreen = ({navigation}) => {
    return (
        <PostList DATA={DATA} />                    // supply a list/array of posts to display as DATA
    );
};