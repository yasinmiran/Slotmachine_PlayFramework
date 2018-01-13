package controllers;

import com.fasterxml.jackson.databind.JsonNode;

import models.User;
import play.data.DynamicForm;
import play.mvc.*;
import repos.UserRepo;
import views.html.*;
import play.data.FormFactory;

import javax.inject.Inject;
import java.time.Duration;

public class MainController extends Controller {

    @Inject
    private FormFactory formFactory;
    @Inject
    private UserRepo userRepo;

    public Result index() {
        return ok(index.render("Player Login", "login"));
    }

    public Result reg$userPage() {
        return ok(index.render("Register", "register"));
    }

    public Result register() {

        DynamicForm df = formFactory.form().bindFromRequest();

        if (!df.get("email").isEmpty() && df.get("paw").equals(df.get("cpaw"))) {
            userRepo.save(new User(df.get("email"), df.get("cpaw")));
            return redirect("/");
        } else {
            return badRequest(index.render("Register", "register"));
        }

    }

    public Result login() {

        DynamicForm df = formFactory.form().bindFromRequest();
        User user = userRepo.findByEmail(df.get("email"));

        if (user != null && (user.getEmail().equals(df.get("email")) && user.getPass().equals(df.get("paw")))) {
            return ok(index.render("Slotmachine", "slotmachine"));
        } else {
            return ok(index.render("Login", "login"));
        }

    }

    public Result stats() {

        JsonNode json = request().body().asJson();
        if (json != null) {

            int totalWins = Integer.parseInt(json.get("totalWins").toString());
            int totalLoses = Integer.parseInt(json.get("totalLoses").toString());
            int totalPartialWins = Integer.parseInt(json.get("totalPartialWins").toString());
            int totalSpins = Integer.parseInt(json.get("totalSpins").toString());
            int creditsWon = Integer.parseInt(json.get("creditsWon").toString());
            int creditsLost = Integer.parseInt(json.get("creditsLost").toString());

            int avg = calculateAverage((totalWins + totalPartialWins), totalSpins);
            String feedback = getFeedback(avg);

            return ok(main.render("Statistics",
                    stats.render(totalWins, totalLoses, totalPartialWins, totalSpins, creditsWon, creditsLost,
                            feedback, avg, coinsNettedPerGame(creditsWon, creditsLost))));
        } else {
            return badRequest();
        }

    }

    public Result save() {

        JsonNode json = request().body().asJson();
        User user = userRepo.findByEmail(json.get("email").asText());

        System.out.println(json);
        if (user != null) {

            userRepo.delete(user);
            user.setTotalWins(Integer.parseInt(json.get("totalWins").toString()));
            user.setTotalLoses(Integer.parseInt(json.get("totalLoses").toString()));
            user.setTotalPartialWins(Integer.parseInt(json.get("totalPartialWins").toString()));
            user.setTotalSpins(Integer.parseInt(json.get("totalSpins").toString()));
            user.setCreditsWon(Integer.parseInt(json.get("creditsWon").toString()));
            user.setCreditsLost(Integer.parseInt(json.get("creditsLost").toString()));
            user.setCoinsNetted(Integer.parseInt(json.get("coinsNetted").toString()));
            user.setAverage(Integer.parseInt(json.get("average").toString()));
            user.setDate(json.get("date").textValue());
            userRepo.save(user);

            return ok("Data Saved!");

        } else {

            return ok("Wrong Email Address!");
        }
    }

    public Result view() {

        JsonNode json = request().body().asJson();
        User user = userRepo.findByEmail(json.get("email").asText());

        if (user != null) {

            return ok(oldstats.render(
                    user.getEmail(),
                    user.getDate(),
                    user.getTotalWins(),
                    user.getTotalLoses(),
                    user.getTotalPartialWins(),
                    user.getTotalSpins(),
                    user.getCreditsWon(),
                    user.getCreditsLost(),
                    user.getCoinsNetted(),
                    user.getAverage()
            ));

        } else {

            return badRequest("Wrong Email Address");
        }
    }

    /**
     * @return average as a Integer
     */
    private static int calculateAverage(int wins, int spins) {
        // This calculates the average of a given player
        return (int) ((double) wins / (double) spins * 100d);
    }

    /**
     * @param avg of the player.
     * @return the feedback for the calculated average.
     */
    private static String getFeedback(int avg) {

        if (avg >= 75) {
            return "You've been winning most of the time. Excellent Job!";
        } else if (avg >= 50) {
            return "Your performance is positive. Great Job!";
        } else if (avg >= 25) {
            return "Your performance is average. You Did a Good Job!";
        } else {
            return "You've been losing all time. Let's try Again! :(";
        }
    }

    private static int coinsNettedPerGame(int won, int lost) {
        return won - lost;
    }
}
