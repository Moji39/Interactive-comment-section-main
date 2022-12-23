export default function CommentsReducer(comments, action) {
    switch (action.type) {
      case 'add': {
        return [
          ...comments,
          {
            id: action.id,
            score: 0,
            created_since: "0y 0m 0w 0d 0h 0i 1s",
            content: action.text,
            user: action.user,
            replying_to: action.replyId,
            replies: []
          },
        ];
      }
      case 'edit': {
        return comments.map(c => {
            if (c.id === action.commentId) {
              return {
                ...c,
                content: action.newText
              }
            } else {
              return c;
            }
        });
      }
      case 'delete': {
        return comments.filter(c => c.id !== action.commentId)
                       .map(c => {
                          if(c.id === action.parentId)
                            c.replies.splice(c.replies.indexOf(action.commentId), 1)
                          return c
                       })
      }
      case 'reply': {
        comments.map(c => {
          if(c.id === action.replyId)
            c.replies.push(action.id)
          return c
        })
        return [
          ...comments,
          {
            id: action.id,
            score: 0,
            created_since: "0y 0m 0w 0d 0h 0i 1s",
            content: action.text,
            user: action.user,
            replying_to: action.replyId,
            replies: []
          }
        ]
      }
      case 'updateComments': {
        return action.comments
      }
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }
  