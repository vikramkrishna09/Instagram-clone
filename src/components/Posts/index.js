import React, {Component} from "react";
import "./Posts.css";
import gql from "graphql-tag";
import Post from "../Post";
import Notifier from "../Notifier";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap-theme.min.css' // optional
import { Mutation } from "react-apollo";

import { Query } from "react-apollo";


class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
    this.offline = !navigator.onLine;
  }
  componentDidMount() {
    // request permission
    Notification.requestPermission();
    const accountname = window.location.pathname.split('/')[1];

    if (this.offline) {
      this.setState({ posts: JSON.parse(localStorage.getItem("posts")) });
    } else {



      // fetch the initial posts
      this.props.apollo_client
        .query({
          query: gql`
            {
              posts(user_id: "a") {
                id
                user {
                  nickname
                  avatar
                }
                image
                caption
              }
            }
          `

        })


        .then(response => {
          this.setState({ posts: response.data.posts });
          localStorage.setItem("posts", JSON.stringify(response.data.posts));
        });
    }

    const user_id= accountname;

    //  subscribe to posts channel
    const queryyy = gql`

      mutation posts($user_id: String!)
      {
        posts(user_id: $user_id) {
          id
          user {
            nickname
            avatar
          }
          image
          caption
        }
      }`;


<Mutation mutat = {queryyy} variables = {{accountname}}>
{(posts, { loading, error, data }) => (
     <div>
       <p onClick={posts}>
         {}
       </p>
       {loading && <p>Loading...</p>}
       {error && <p>Error :( Please try again</p>}
     </div>
   )}
</Mutation>
console.log(accountname)
    this.posts_channel = this.props.pusher.subscribe("posts-channel");

    // listen for a new post
    this.posts_channel.bind(
      "new-post",
      data => {
        this.setState({ posts: this.state.posts.concat(data.post) });

        // check for notifications
        if (Notification.permission === "granted") {
          try {
            // notify user of new post
            let notification = new Notification("Pusher Instagram Clone", {
              body: `New post from ${data.post.user.nickname}`,
              icon: "https://img.stackshare.io/service/115/Pusher_logo.png",
              image: `${data.post.image}`
            });

            notification.onclick = function(event) {
              window.open("http://localhost:3000", "_blank");
            };
          } catch (e) {
            console.log("Error displaying notification");
          }
        }
      },
      this
    );
  }


  render() {
    const myRow = ({index})=>{(<div className="col-md-4">{index}</div>)};
    const col1 = [],col2 = [],col3=[],col4=[];


    const notify = this.offline ? <Notifier data="Instagram Clone: Offline Mode" /> : <span />;
    this.state.posts
      .slice(0)
      .reverse()
      .map(post => (
        <Post
          nickname={post.user.nickname}
          avatar={post.user.avatar}
          image={post.image}
          caption={post.caption}
          key={post.id}
        />
      ))
    var i;
    var y;
    for(i = 0; i < this.state.posts.length;i++)
    {
      if(i%4===1)
      {
        col4.push(this.state.posts[i])
      }
      else if(i%4===2){
        col3.push(this.state.posts[i])

      }
      else if(i%4===3)
      {
        col2.push(this.state.posts[i])
      }

      else if(i%4===0)
      {
        col1.push(this.state.posts[i])
      }
    }

    return (

      <div>
        {notify}
        <div className="Posts">

                <div className="col-md-4">
                {col1.map(post => (
                    <Post
                      nickname={post.user.nickname}
                      avatar={post.user.avatar}
                      image={post.image}
                      caption={post.caption}
                      key={post.id}
                    />
                  ))}
                </div>
                <div className="col-md-4">
                  {col2.map(post => (
                      <Post
                        nickname={post.user.nickname}
                        avatar={post.user.avatar}
                        image={post.image}
                        caption={post.caption}
                        key={post.id}
                      />
                    ))}
                </div>

                <div className="col-md-4">
                  {col3.map(post => (
                      <Post
                        nickname={post.user.nickname}
                        avatar={post.user.avatar}
                        image={post.image}
                        caption={post.caption}
                        key={post.id}
                      />
                    ))}
                </div>

                <div className="col-md-4">
                  {col4.map(post => (
                      <Post
                        nickname={post.user.nickname}
                        avatar={post.user.avatar}
                        image={post.image}
                        caption={post.caption}
                        key={post.id}
                      />
                    ))}
                </div>











    </div>
    </div>
    );
  }
}

export default Posts;
