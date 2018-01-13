package controllers;

import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;
import it.unifi.cerm.playmorphia.MongoClientFactory;
import play.Configuration;
import java.util.Arrays;

public class MyMongoClientFactory extends MongoClientFactory {

    private Configuration config;

    public MyMongoClientFactory(Configuration config) {
        super(config);
        this.config = config;
    }

    public MongoClient createClient() throws Exception {
        return new MongoClient(Arrays.asList(
                new ServerAddress("yazeencluster0-shard-00-00-5amgi.mongodb.net", 27017),
                new ServerAddress("yazeencluster0-shard-00-01-5amgi.mongodb.net", 27017),
                new ServerAddress("yazeencluster0-shard-00-02-5amgi.mongodb.net", 27017))
        );
    }

    public String getDBName() {
        return config.getString("playmorphia.database");
    }

}