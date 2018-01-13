package it.unifi.cerm.playmorphia;

import com.mongodb.DB;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import play.Configuration;

public class MongoClientFactory {

    protected Configuration config;
    protected boolean isTest;

    public MongoClientFactory(Configuration config) {
        this.config = config;
    }

    protected MongoClientFactory(Configuration config, boolean isTest) {
        this.config = config;
        this.isTest = isTest;
    }

    /**
     * Creates and returns a new instance of a MongoClient.
     * @return a new MongoClient
     */
    public MongoClient createClient() throws Exception {
        MongoClientURI uri = getClientURI();

        MongoClient mongo = new MongoClient(uri);
        DB db = new DB(mongo, uri.getDatabase());

        return mongo;
    }


    /**
     * Returns the database name associated with the current configuration.
     * @return The database name
     */
    public String getDBName() {
        return getClientURI().getDatabase();
    }

    protected MongoClientURI getClientURI() {
        return new MongoClientURI(config.getString("playmorphia.uri",
                "mongodb://thariq:KRhu8FI3ORNnVX10@yazeencluster0-shard-00-00-5amgi.mongodb.net:27017,yazeencluster0-shard-00-01-5amgi.mongodb.net:27017,yazeencluster0-shard-00-02-5amgi.mongodb.net:27017/slotmachine?ssl=true&replicaSet=YazeenCluster0-shard-0&authSource=admin"));
    }

    /**
     * Returns the models folder name associated with the current configuration.
     *
     * @return The models folder name
     */
    public String getModels() {
        return config.getString("playmorphia.models", "models");
    }

}
