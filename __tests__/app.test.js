const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("Nc-News error ", () => {
  test("responds with 404, when given wrong path", () => {
    return request(app)
      .get("/api/does-not-exist")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/topics ", () => {
  test("responds with 200 and all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api", () => {
  test("responds with accurate JSON object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const endpointsCompare = require("../endpoints.json");
        expect(body.endpoints).toEqual(endpointsCompare);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("responds with 200 and specific article when given id", () => {
    const articleToCompare = {
      article_id: 2,
      title: "Sony Vaio; or, The Laptop",
      topic: "mitch",
      author: "icellusedkars",
      body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
      created_at: "2020-10-16T05:03:00.000Z",
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject(articleToCompare);
      });
  });

  test("responds with 404 and message article does not exist, when article by id doesnt exist", () => {
    return request(app)
      .get("/api/articles/9000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("responds with 400 and message bad request, when given an id that isnt a number ", () => {
    return request(app)
      .get("/api/articles/gee")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles ", () => {
  test("responds with 200 and all articles in descending order with comment counts", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
      });
  });

  test("responds with 200 and all articles filtered by the query topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
      });
  });
  test("responds with 200 and 0 articles if the topic exists but doesnt have any  articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(0);
      });
  });
  test("responds with 404 and 0 articles if the topic doesnt exist", () => {
    return request(app)
      .get("/api/articles?topic=carrots")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("carrots does not exist");
      });
  });
});

describe("GET /api/articles QUERIES ", () => {
  test("responds with 200 and all articles in descending order sorted by votes", () => {
    return request(app)
      .get("/api/articles/?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);

        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("responds with 200 and all articles in descending order sorted by title", () => {
    return request(app)
      .get("/api/articles/?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);

        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("responds with 200 and all articles in ascending order sorted by author", () => {
    return request(app)
      .get("/api/articles/?sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);

        expect(articles).toBeSortedBy("author", { descending: false });
      });
  });

  test("responds with 400 and invalid sort parameter", () => {
    return request(app)
      .get("/api/articles/?sort_by=bob")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          'Bad request parameter:  must be one of: article_id, title, author, created_at, topic, votes.'
        );
      });
  });
  test("responds with 400 and invalid sort parameter", () => {
    return request(app)
      .get("/api/articles/?sort_by=author&order=bob")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          'Bad request parameter: must be either "asc" or "desc".'
        );
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("responds with 200 and specific comment when given id", () => {
    const commentToCompare = [
      {
        comment_id: 16,
        body: "This is a bad article name",
        article_id: 6,
        author: "butter_bridge",
        votes: 1,
        created_at: "2020-10-11T15:23:00.000Z",
      },
    ];
    return request(app)
      .get("/api/articles/6/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments).toEqual(commentToCompare);
      });
  });

  test("responds with 200 and specific comments when given id ordered by newest created first", () => {
    const commentsToCompare = [
      {
        comment_id: 14,
        body: "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
        article_id: 5,
        author: "icellusedkars",
        votes: 16,
        created_at: "2020-06-09T05:00:00.000Z",
      },
      {
        comment_id: 15,
        body: "I am 100% sure that we're not completely sure.",
        article_id: 5,
        author: "butter_bridge",
        votes: 1,
        created_at: "2020-11-24T00:08:00.000Z",
      },
    ];

    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual(commentsToCompare);
        expect(comments).toBeSortedBy("created_at");
      });
  });

  test("responds with 200 and an empy array when there are no comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });

  test("responds with 404 and message article does not exist, when article by id doesnt exist", () => {
    return request(app)
      .get("/api/articles/9000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });

  test("responds with 400 and message bad request, when given an id that isnt a number", () => {
    return request(app)
      .get("/api/articles/apples/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("responds with 201 and specific comment when given id an idea that exists and a comment", () => {
    const newComment = {
      username: "rogersop",
      body: "This is a great comment!",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comments = body;

        expect(comments).toEqual(" a");
      });
  });
  test("responds with 404 and message article does not exist, when article by id doesnt exist", () => {
    const newComment = {
      username: "rogersop",
      body: "This is a great comment!",
    };

    return request(app)
      .post("/api/articles/9000/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("responds with 400 and equest body must include username and body properties if not given a user name", () => {
    const newComment = { body: "hello world" };

    return request(app)
      .post("/api/articles/4/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "request body must include username and body properties"
        );
      });
  });

  test("responds with 404 and User not found if user does not exist", () => {
    const newComment = { username: "Bob", body: "hello world" };

    return request(app)
      .post("/api/articles/4/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
  test("responds with 400 and message bad request, when given an id that isnt a number", () => {
    const newComment = {
      username: "rogersop",
      body: "This is a great comment!",
    };
    return request(app)
      .post("/api/articles/apples/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id/comments", () => {
  test("responds with 200 and the updated article when given a valid article id and inc_votes", () => {
    const newVotes = { inc_votes: 10 };
    const articleToCompare = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 110,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(articleToCompare);
      });
  });

  test("responds with 200 and the updated article when given a valid article id and inc_votes with a negative value", () => {
    const newVotes = { inc_votes: -20 };
    const articleToCompare = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 80,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(articleToCompare);
      });
  });
  test("responds with 400 and Bad request: inc_votes is required with no inc_votes key", () => {
    const newVotes = { incc_votes: 3 };

    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: inc_votes is required");
      });
  });
  test("responds with 400 and 'Bad request: inc_votes value must be number when value of inc_votes is not a number", () => {
    const newVotes = { inc_votes: "3" };

    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: inc_votes value must be number");
      });
  });
  test("responds with 404 and message article does not exist, when article by id doesnt exist", () => {
    const newVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/9000")
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("responds with 400 and message bad request, when given an id that isnt a number ", () => {
    const newVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/gee")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("responds with 204 and an empty response", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  test("responds with 404 if comment id does not exist", () => {
    return request(app)
      .delete("/api/comments/9000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });

  test("responds with 40O if id is not a number", () => {
    return request(app)
      .delete("/api/comments/gjdhg")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("responds with 200 and all users with username, name, and avatar_url properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(4);

        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("responds with 404 not found if miss typed url", () => {
    return request(app)
      .get("/api/userss")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles/:article_id(comment_count)", () => {
  test("responds with 200 and specific article when given id and comment count", () => {
    const articleToCompare = {
      article_id: 2,
      title: "Sony Vaio; or, The Laptop",
      topic: "mitch",
      author: "icellusedkars",
      body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
      created_at: "2020-10-16T05:03:00.000Z",
      votes: 0,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      comment_count: 0,
    };
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(articleToCompare);
      });
  });
});



describe("GET /api/users/:username", () => {
  test("responds with 200 and specific user data when given a valid username", () => {
    const userToCompare = {
      username: "butter_bridge",
      name: "jonny",
      avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
    };

    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
       
        expect(body.user).toMatchObject(userToCompare);
      });
  });

  test("responds with 404 and message 'user does not exist' when user by username doesn't exist", () => {
    return request(app)
      .get("/api/users/nonexistent_user")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });


});

describe("PATCH /api/comments/:comment_id", () => {
  test("responds with 200 and the updated comment when given a valid comment id and inc_votes", () => {
    const newVotes = { inc_votes: 10 };
    const commentToCompare = {
      comment_id: 1,
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 9,
      author: 'butter_bridge',
      votes: 26,
      created_at: '2020-04-06T12:17:00.000Z'
    }

    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(commentToCompare);
      });
  });

  test("responds with 200 and the updated comment when given a valid comment id and inc_votes with a negative value", () => {
    const newVotes = { inc_votes: -5 };
    const commentToCompare =  {
      comment_id: 1,
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      article_id: 9,
      author: 'butter_bridge',
      votes: 11,
      created_at: '2020-04-06T12:17:00.000Z'
    }

    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(commentToCompare);
      });
  });

  test("responds with 400 and 'Bad request: inc_votes is required' with no inc_votes key", () => {
    const newVotes = { incc_votes: 3 };

    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: inc_votes is required");
      });
  });

  test("responds with 400 and 'Bad request: inc_votes value must be a number' when value of inc_votes is not a number", () => {
    const newVotes = { inc_votes: "3" };

    return request(app)
      .patch("/api/comments/1")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: inc_votes value must be a number");
      });
  });

  test("responds with 404 and 'Comment not found' when given a non-existing comment id", () => {
    const newVotes = { inc_votes: 10 };

    return request(app)
      .patch("/api/comments/1000")
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });

  test("responds with 400 and 'Bad request' when given an invalid comment id", () => {
    const newVotes = { inc_votes: 10 };

    return request(app)
      .patch("/api/comments/invalid_id")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });

  test("responds with 400 and 'Bad request' when given a comment id with invalid characters", () => {
    const newVotes = { inc_votes: 10 };

    return request(app)
      .patch("/api/comments/!@#$%")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
