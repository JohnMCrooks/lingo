package com.theironyard;

import com.theironyard.entities.*;
import com.theironyard.services.CategoryRepository;
import com.theironyard.services.DictionaryRepository;
import com.theironyard.utils.PasswordStorage;
import org.h2.tools.Server;

import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;
import com.theironyard.services.ArticleRepository;
import com.theironyard.services.UserRepository;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;


@RestController
public class LingoRestController {

    @Autowired
    UserRepository users;

    @Autowired
    ArticleRepository articles;

    @Autowired
    DictionaryRepository dictionaries;

    @Autowired
    CategoryRepository categories;

    Server dbui = null;

    @PostConstruct
    public void init() throws SQLException, IOException, InterruptedException {
        dbui.createWebServer().start();
        parseDictionary();

        Category cat = new Category("business", 1);
        System.out.println(cat);
        if (categories.count() == 0) {
            categories.save(cat);
            cat = new Category("politics",2);
            categories.save(cat);
            cat = new Category("sports",3);
            categories.save(cat);
            cat = new Category("arts",4);
            categories.save(cat);
            cat = new Category("technology",5);
            categories.save(cat);
        }
    }

    @PreDestroy
    public void destroy(){dbui.stop();}


    @RequestMapping(path = "/login", method = RequestMethod.POST)
    public Boolean login(@RequestBody User user, HttpSession session,  java.util.Date date) throws Exception {

        User user1 = users.findByUsername(user.getUsername());            //check to see if supplied username is in the DB
        if (user1 == null) {                                              //if it isn't, return false so front end to handle it
            return false;
        }
        else if (!PasswordStorage.verifyPassword(user.getPassword(), user1.getPassword())){  //if it is, check the Password supplied against the stored password, return false if not the same
            return false;
        }
        session.setAttribute("username", user1.getUsername());
        return true;
    }

    @RequestMapping(path = "/registerUser", method = RequestMethod.POST)
    public Boolean register(@RequestBody User user, HttpServletResponse response, HttpSession session) throws PasswordStorage.CannotPerformOperationException, IOException {
        if(users.findByUsername(user.getUsername())!= null){          // If the username is in the DB return false
            return false;
        }else {                                                       //Otherwise create the user and add it to the DB
            User user1 = new User(user.getUsername(), PasswordStorage.createHash(user.getPassword()));
            users.save(user1);
            session.setAttribute("username", user1.getUsername());
            return true;
        }
    }

    @RequestMapping(path = "/preferences", method = RequestMethod.GET)
    public User getPreferences( HttpSession session) throws Exception {
       if (session.getAttribute("username") != null){                 //if the session is valid, return user preferences from the DB
           return users.findByUsername((String) session.getAttribute("username"));
       } else{
           throw new Exception("you must be logged in to change preferences");
       }
    }

    @RequestMapping(path = "/preferences", method = RequestMethod.POST)
    public User setPreferences(@RequestBody User user, HttpSession session) throws Exception {
        if (session.getAttribute("username") ==null){                  //check session to make sure it's valid
            throw new Exception("You must Login to view or change your preferences!");
        }else {
            User userA = users.findByUsername((String) session.getAttribute("username"));  //grab the user and info from the db
            userA.setLanguage(user.getLanguage());                       //set the new preferences
            userA.setTechnology(user.getTechnology());
            userA.setArts(user.getArts());
            userA.setBusiness(user.getBusiness());
            userA.setSports(user.getSports());
            userA.setPolitics(user.getPolitics());
            userA.setLangLevel(user.getLangLevel());


            if (user.getArts()) {                                           // if a preference is set to true - add the relationship
                Category cat = categories.findFirstByType("arts");
                userA.getCatList().add(cat);
            }
            if(user.getBusiness()){
                Category cat = categories.findFirstByType("business");
                userA.getCatList().add(cat);
            }
            if(user.getPolitics()){
                Category cat = categories.findFirstByType("politics");
                userA.getCatList().add(cat);
            }
            if(user.getSports()){
                Category cat = categories.findFirstByType("sports");
                userA.getCatList().add(cat);
            }
            if(user.getTechnology()){
                Category cat = categories.findFirstByType("technology");
                userA.getCatList().add(cat);
            }

            users.save(userA);                                               // after all the changes, save the updated user to the DB
            System.out.println("User saved to Database...");

            return users.save(userA);                                       //return the updated user object for the Front End

        }
    }

    @RequestMapping(path = "/articles", method = RequestMethod.GET)
    public ArrayList<ReturnArticle> getArticles(HttpSession session) throws Exception {
        if (session.getAttribute("username")==null){
            throw new Exception("You must log in to view this page");
        }else {
            User user = users.findByUsername((String) session.getAttribute("username"));

            //this query pulls articles based on preference using the User-category relationship and the article-Category relationship
            String sql = "SELECT ca.CATEGORY_ID, a." + user.getLangLevel() + ", a.title, a.type, a.id"  + "  FROM Articles a " +
            "INNER JOIN CATEGORY_ARTICLE ca ON ca.article_id = a.ID " +
            "INNER JOIN USERS_CATEGORIES uc on uc.catlist_ID = ca.CATEGORY_ID " +
            "WHERE uc.user_id = ? ";

            //had to create a separate connection to h2 db using jdbc to use a custom query. Hibernate was resisting the power of our query
            Connection conn = DriverManager.getConnection("jdbc:h2:./main;DB_CLOSE_ON_EXIT=FALSE", "sa", "");
            PreparedStatement stmnt = conn.prepareStatement(sql);
            stmnt.setInt(1, user.getId());
            ResultSet results = stmnt.executeQuery();

            ArrayList<ReturnArticle> returnArray = new ArrayList<>();

            // creating a new object with category ID, translation, title, and type for the FEE for each article present
            while(results.next()){
                int categoryId = results.getInt(1);
                String translation = results.getString(2);
                String title = results.getString(3);
                String type = results.getString(4);
                int articleId = results.getInt(5);
                ReturnArticle ra1 = new ReturnArticle(categoryId, translation, title, type, articleId);
                returnArray.add(ra1);
            }

            //Create a new array of random, by preference, non-duplicate articles to pass to the front-end.
            ArrayList<ReturnArticle> limitedArray = new ArrayList<>();
            int i = 0;
            do{
                Random rm = new Random();
                ArrayList<Integer> seedArray = new ArrayList<Integer>();
                int seedValue = rm.nextInt(returnArray.size());

                if (!seedArray.contains(seedValue)) {
                    seedArray.add(seedValue);
                    limitedArray.add(returnArray.get(seedValue));
                    i++;
                }
            } while(i<20);

            conn.close();
            return limitedArray;
        }
    }

    @RequestMapping(path = "/article/{articleID}", method=RequestMethod.GET)
    public ReturnArticle returnOne(HttpSession session, @PathVariable int articleID) throws Exception {
        User user = users.findByUsername((String) session.getAttribute("username"));
        Article justTheOne = articles.findById(articleID);
        String content = "";
        if (user.getLangLevel().equals("span1")) {
            content = justTheOne.getSpan1();
        } else if (user.getLangLevel().equals("span2")) {
            content = justTheOne.getSpan2();
        } else if (user.getLangLevel().equals("span3")) {
            content = justTheOne.getSpan3();
        } else if (user.getLangLevel().equals("french1")) {
            content = justTheOne.getFrench1();
        } else if (user.getLangLevel().equals("french2")) {
            content = justTheOne.getFrench2();
        } else if (user.getLangLevel().equals("french3")) {
            content = justTheOne.getFrench3();
        }

        ReturnArticle ra = new ReturnArticle(0, content, justTheOne.getTitle(), justTheOne.getType(), justTheOne.getId());

        return ra;
    }


    @RequestMapping(path = "/logout", method = RequestMethod.POST)
    public void logout(HttpSession session) throws IOException {
        session.invalidate();
    }

    public void parseDictionary() throws FileNotFoundException {
        //Parsing the language dictionary from a csv file into the db at runtime if it hasn't already been created.

        if(dictionaries.count() == 0) {
            File f = new File("Tri-Lingual-Library.csv");
            Scanner scanner = new Scanner(f);
            scanner.nextLine();
            while (scanner.hasNext()) {
                String[] arrayString = scanner.nextLine().split(",");
                Dictionary dictEntry = new Dictionary(arrayString[0], arrayString[1], arrayString[2]);
                dictionaries.save(dictEntry);
            }
            System.out.println("Language Dictionary has been created");//for console testing
        } else {
            System.out.println("Language Dictionary already exists");//for console testing
        }
    }
}
