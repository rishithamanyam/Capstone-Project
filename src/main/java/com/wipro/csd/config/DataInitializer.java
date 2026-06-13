package com.wipro.csd.config;

import com.wipro.csd.model.*;
import com.wipro.csd.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;

@Component
public class DataInitializer {

    @Autowired private UserRepository userRepo;
    @Autowired private TicketRepository ticketRepo;
    @Autowired private OutageRepository outageRepo;
    @Autowired private NotificationRepository notifRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        if (userRepo.count() > 0) return;

        String adminPass = passwordEncoder.encode("admin123");
        String empPass   = passwordEncoder.encode("Welcome@123");
        String custPass  = passwordEncoder.encode("Customer@123");

        User admin = userRepo.save(User.builder()
                .name("System Admin").email("admin@csd.com").password(adminPass)
                .role(User.Role.ADMIN).phone("9000000001").firstLogin(false)
                .createdAt(LocalDateTime.now().minusDays(30)).build());

        User mgr1 = userRepo.save(User.builder()
                .name("John Smith").email("john.smith@csd.com").password(empPass)
                .role(User.Role.MANAGER).phone("9000000002").firstLogin(true)
                .createdAt(LocalDateTime.now().minusDays(20)).build());

        User mgr2 = userRepo.save(User.builder()
                .name("Sarah Jones").email("sarah.jones@csd.com").password(empPass)
                .role(User.Role.MANAGER).phone("9000000003").firstLogin(false)
                .createdAt(LocalDateTime.now().minusDays(20)).build());

        User rep1 = userRepo.save(User.builder()
                .name("Mike Johnson").email("mike.rep@csd.com").password(empPass)
                .role(User.Role.REPRESENTATIVE).phone("9000000004").managerId(mgr1.getId()).firstLogin(false)
                .createdAt(LocalDateTime.now().minusDays(15)).build());

        User rep2 = userRepo.save(User.builder()
                .name("Lisa Brown").email("lisa.rep@csd.com").password(empPass)
                .role(User.Role.REPRESENTATIVE).phone("9000000005").managerId(mgr1.getId()).firstLogin(false)
                .createdAt(LocalDateTime.now().minusDays(15)).build());

        User rep3 = userRepo.save(User.builder()
                .name("James Wilson").email("james.rep@csd.com").password(empPass)
                .role(User.Role.REPRESENTATIVE).phone("9000000006").managerId(mgr2.getId()).firstLogin(false)
                .createdAt(LocalDateTime.now().minusDays(10)).build());

        User rep4 = userRepo.save(User.builder()
                .name("Amy Davis").email("amy.rep@csd.com").password(empPass)
                .role(User.Role.REPRESENTATIVE).phone("9000000007").managerId(mgr2.getId()).firstLogin(false)
                .createdAt(LocalDateTime.now().minusDays(10)).build());

        User cust1 = userRepo.save(User.builder()
                .name("Alice Johnson").email("alice@gmail.com").password(custPass)
                .role(User.Role.CUSTOMER).phone("9111000001").location("New York").firstLogin(false)
                .createdAt(LocalDateTime.now().minusDays(10)).build());

        User cust2 = userRepo.save(User.builder()
                .name("Bob Williams").email("bob@gmail.com").password(custPass)
                .role(User.Role.CUSTOMER).phone("9111000002").location("Los Angeles").firstLogin(false)
                .createdAt(LocalDateTime.now().minusDays(8)).build());

        User cust3 = userRepo.save(User.builder()
                .name("Carol Davis").email("carol@gmail.com").password(custPass)
                .role(User.Role.CUSTOMER).phone("9111000003").location("Chicago").firstLogin(false)
                .createdAt(LocalDateTime.now().minusDays(5)).build());

        User cust4 = userRepo.save(User.builder()
                .name("David Clark").email("david@gmail.com").password(custPass)
                .role(User.Role.CUSTOMER).phone("9111000004").location("Houston").firstLogin(false)
                .createdAt(LocalDateTime.now().minusDays(3)).build());

        LocalDateTime base = LocalDateTime.now().minusDays(7);

        Ticket t1 = ticketRepo.save(Ticket.builder()
                .customerId(cust1.getId()).customerName(cust1.getName()).customerPhone(cust1.getPhone())
                .customerLocation(cust1.getLocation()).domain("Internet Services")
                .subject("No internet connection at home").description("My internet has been down since morning. Router shows all lights green but no connectivity.")
                .status(Ticket.TicketStatus.OPEN).createdAt(base.minusDays(2)).build());

        Ticket t2 = ticketRepo.save(Ticket.builder()
                .customerId(cust2.getId()).customerName(cust2.getName()).customerPhone(cust2.getPhone())
                .customerLocation(cust2.getLocation()).domain("TV & Cable")
                .subject("Channels not loading").description("Premium channels are not loading. Getting error code E101.")
                .status(Ticket.TicketStatus.OPEN).createdAt(base.minusDays(1)).build());

        Ticket t3 = ticketRepo.save(Ticket.builder()
                .customerId(cust3.getId()).customerName(cust3.getName()).customerPhone(cust3.getPhone())
                .customerLocation(cust3.getLocation()).domain("Mobile Data")
                .subject("4G not working").description("Mobile data stopped working after the recent plan renewal.")
                .status(Ticket.TicketStatus.OPEN).createdAt(base).build());

        LocalDateTime t4Created = base.minusDays(5);
        LocalDateTime t4Response = t4Created.plusHours(2);
        ticketRepo.save(Ticket.builder()
                .customerId(cust1.getId()).customerName(cust1.getName()).customerPhone(cust1.getPhone())
                .customerLocation(cust1.getLocation()).domain("Internet Services")
                .subject("Slow internet speed").description("Experiencing very slow speeds. Getting only 2 Mbps vs promised 100 Mbps.")
                .status(Ticket.TicketStatus.IN_PROGRESS).repId(rep1.getId()).repName(rep1.getName())
                .managerId(mgr1.getId()).createdAt(t4Created).firstResponseAt(t4Response)
                .responseTimeHrs(2.0).build());

        LocalDateTime t5Created = base.minusDays(4);
        LocalDateTime t5Response = t5Created.plusHours(1);
        ticketRepo.save(Ticket.builder()
                .customerId(cust4.getId()).customerName(cust4.getName()).customerPhone(cust4.getPhone())
                .customerLocation(cust4.getLocation()).domain("Phone Services")
                .subject("Call drops frequently").description("Calls drop every few minutes. Issue started 4 days ago.")
                .status(Ticket.TicketStatus.IN_PROGRESS).repId(rep2.getId()).repName(rep2.getName())
                .managerId(mgr1.getId()).createdAt(t5Created).firstResponseAt(t5Response)
                .responseTimeHrs(1.0).build());

        LocalDateTime t6Created = base.minusDays(3);
        LocalDateTime t6Response = t6Created.plusHours(3);
        ticketRepo.save(Ticket.builder()
                .customerId(cust2.getId()).customerName(cust2.getName()).customerPhone(cust2.getPhone())
                .customerLocation(cust2.getLocation()).domain("Technical Support")
                .subject("Router configuration issue").description("Need help configuring the new router provided by CSD.")
                .status(Ticket.TicketStatus.IN_PROGRESS).repId(rep3.getId()).repName(rep3.getName())
                .managerId(mgr2.getId()).createdAt(t6Created).firstResponseAt(t6Response)
                .responseTimeHrs(3.0).build());

        LocalDateTime t7Created = base.minusDays(6);
        LocalDateTime t7Response = t7Created.plusHours(1);
        LocalDateTime t7Resolved = t7Created.plusHours(5);
        ticketRepo.save(Ticket.builder()
                .customerId(cust3.getId()).customerName(cust3.getName()).customerPhone(cust3.getPhone())
                .customerLocation(cust3.getLocation()).domain("Internet Services")
                .subject("Billing discrepancy").description("Charged for services I did not subscribe to.")
                .status(Ticket.TicketStatus.CLOSED).repId(rep1.getId()).repName(rep1.getName())
                .managerId(mgr1.getId()).createdAt(t7Created).firstResponseAt(t7Response)
                .resolvedAt(t7Resolved).responseTimeHrs(1.0).resolutionTimeHrs(5.0).rating(5).build());

        LocalDateTime t8Created = base.minusDays(8);
        LocalDateTime t8Response = t8Created.plusHours(2);
        LocalDateTime t8Resolved = t8Created.plusHours(8);
        ticketRepo.save(Ticket.builder()
                .customerId(cust4.getId()).customerName(cust4.getName()).customerPhone(cust4.getPhone())
                .customerLocation(cust4.getLocation()).domain("TV & Cable")
                .subject("Missing premium channels").description("Channels 301–350 missing after plan upgrade.")
                .status(Ticket.TicketStatus.CLOSED).repId(rep2.getId()).repName(rep2.getName())
                .managerId(mgr1.getId()).createdAt(t8Created).firstResponseAt(t8Response)
                .resolvedAt(t8Resolved).responseTimeHrs(2.0).resolutionTimeHrs(8.0).rating(4).build());

        LocalDateTime t9Created = base.minusDays(10);
        LocalDateTime t9Response = t9Created.plusHours(1);
        LocalDateTime t9Resolved = t9Created.plusHours(4);
        ticketRepo.save(Ticket.builder()
                .customerId(cust1.getId()).customerName(cust1.getName()).customerPhone(cust1.getPhone())
                .customerLocation(cust1.getLocation()).domain("Mobile Data")
                .subject("SIM activation issue").description("New SIM card not activating after 24 hours.")
                .status(Ticket.TicketStatus.CLOSED).repId(rep3.getId()).repName(rep3.getName())
                .managerId(mgr2.getId()).createdAt(t9Created).firstResponseAt(t9Response)
                .resolvedAt(t9Resolved).responseTimeHrs(1.0).resolutionTimeHrs(4.0).rating(5).build());

        LocalDateTime t10Created = base.minusDays(12);
        LocalDateTime t10Response = t10Created.plusHours(4);
        LocalDateTime t10Resolved = t10Created.plusHours(12);
        ticketRepo.save(Ticket.builder()
                .customerId(cust2.getId()).customerName(cust2.getName()).customerPhone(cust2.getPhone())
                .customerLocation(cust2.getLocation()).domain("Technical Support")
                .subject("Modem keeps restarting").description("Modem restarts every 30 minutes automatically.")
                .status(Ticket.TicketStatus.CLOSED).repId(rep4.getId()).repName(rep4.getName())
                .managerId(mgr2.getId()).createdAt(t10Created).firstResponseAt(t10Response)
                .resolvedAt(t10Resolved).responseTimeHrs(4.0).resolutionTimeHrs(12.0).rating(3).build());

        outageRepo.save(Outage.builder()
                .location("New York").affectedAreas("Manhattan, Brooklyn, Queens")
                .domain("Internet Services").description("Fiber cable damage due to road construction affecting connectivity.")
                .severity("HIGH").status("ACTIVE").createdAt(LocalDateTime.now().minusHours(6)).build());

        outageRepo.save(Outage.builder()
                .location("Chicago").affectedAreas("Downtown, North Side")
                .domain("TV & Cable").description("Signal disruption caused by equipment maintenance at central hub.")
                .severity("MEDIUM").status("RESOLVED").createdAt(LocalDateTime.now().minusDays(2))
                .resolvedAt(LocalDateTime.now().minusDays(1)).build());

        notifRepo.save(Notification.builder().userId(mgr1.getId())
                .message("New outage reported in New York — Internet Services. Check the outage map for details.")
                .type("OUTAGE").read(false).createdAt(LocalDateTime.now().minusHours(6)).build());

        notifRepo.save(Notification.builder().userId(rep1.getId())
                .message("New ticket #" + t1.getId() + " assigned from " + cust1.getName() + " — Internet Services.")
                .type("TICKET").read(false).createdAt(LocalDateTime.now().minusDays(2)).build());

        notifRepo.save(Notification.builder().userId(cust1.getId())
                .message("Your ticket #" + t7.getId() + " has been closed. Please rate your experience.")
                .type("STATUS").read(false).createdAt(LocalDateTime.now().minusDays(6)).build());

        notifRepo.save(Notification.builder().userId(mgr1.getId())
                .message("Welcome to CSD. Your account has been created. Temporary password: Welcome@123. Change it on first login.")
                .type("CREDENTIAL").read(false).createdAt(LocalDateTime.now().minusDays(20)).build());
    }
}
