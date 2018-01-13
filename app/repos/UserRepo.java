package repos;


import com.google.inject.Inject;
import it.unifi.cerm.playmorphia.PlayMorphia;
import models.User;

public class UserRepo {

    @Inject
    private PlayMorphia morphia;

    public User findByEmail(String id) {
//        return morphia.datastore().createQuery(User.class).field("email").equalIgnoreCase(id).get();
        return morphia.datastore().createQuery(User.class).field("email").equal(id).get();
    }

    public void save(User u) {
        morphia.datastore().save(u);
    }

    public void delete(User u) {
        morphia.datastore().delete(u);
    }

}