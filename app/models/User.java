package models;

import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;

@Entity(value = "users")
public class User {

    @Id
    private ObjectId _id;
    private String email;
    private String pass;
    private String date;

    private int totalWins;
    private int totalLoses;
    private int totalPartialWins;
    private int totalSpins;
    private int creditsWon;
    private int creditsLost;
    private int coinsNetted;
    private int average;

    public ObjectId getId() {
        return _id;
    }

    public void setId(ObjectId _id) {
        this._id = _id;
    }

    public User() {
    }

    public User(String email, String pass) {
        this.email = email;
        this.pass = pass;
        this.date = "No Records Found!";
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPass() {
        return pass;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public int getTotalWins() {
        return totalWins;
    }

    public void setTotalWins(int totalWins) {
        this.totalWins = totalWins;
    }

    public int getTotalLoses() {
        return totalLoses;
    }

    public void setTotalLoses(int totalLoses) {
        this.totalLoses = totalLoses;
    }

    public int getTotalPartialWins() {
        return totalPartialWins;
    }

    public void setTotalPartialWins(int totalPartialWins) {
        this.totalPartialWins = totalPartialWins;
    }

    public int getTotalSpins() {
        return totalSpins;
    }

    public void setTotalSpins(int totalSpins) {
        this.totalSpins = totalSpins;
    }

    public int getCreditsWon() {
        return creditsWon;
    }

    public void setCreditsWon(int creditsWon) {
        this.creditsWon = creditsWon;
    }

    public int getCreditsLost() {
        return creditsLost;
    }

    public void setCreditsLost(int creditsLost) {
        this.creditsLost = creditsLost;
    }

    public int getCoinsNetted() {
        return coinsNetted;
    }

    public void setCoinsNetted(int coinsNetted) {
        this.coinsNetted = coinsNetted;
    }

    public int getAverage() {
        return average;
    }

    public void setAverage(int average) {
        this.average = average;
    }
}
