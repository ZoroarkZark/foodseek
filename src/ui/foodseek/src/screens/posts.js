import React from "react";
import PostList from "../components/post/PostList";
import { DATA } from "../components/post/TestData";

export const PostsScreen = ({navigation}) => {
    return (
        <PostList DATA={DATA} />
    );
};