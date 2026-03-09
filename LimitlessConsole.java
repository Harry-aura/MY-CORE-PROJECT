import java.util.*;

public class LimitlessConsole {
    static class User {
        String name;
        String password;
        int age;
        public User(String name, String password, int age) {
            this.name = name; this.password = password; this.age = age;
        }
    }

    static class Block {
        int id;
        String app, url, goal;
        int duration, attempts;
        long lockedUntil;

        public Block(int id, String app, String url, String goal, int duration) {
            this.id = id; this.app = app; this.url = url; this.goal = goal; this.duration = duration;
            this.attempts = new Random().nextInt(5);
            this.lockedUntil = System.currentTimeMillis() + (3L * 60 * 60 * 1000); // 3 Hours
        }
    }

    static Scanner sc = new Scanner(System.in);
    static User registeredUser = null;
    static boolean loggedIn = false;
    static List<Block> blocks = new ArrayList<>();
    static LinkedList<String> activities = new LinkedList<>();
    static int blockCounter = 1;

    public static void main(String[] args) {
        while (true) {
            if (!loggedIn) {
                authMenu();
            } else {
                mainMenu();
            }
        }
    }

    static void authMenu() {
        System.out.println("\n--- LIMITLESS: SECURE NEURAL LINK ---");
        System.out.println("1. Login\n2. Create Account\n3. Exit");
        System.out.print("Choice: ");
        String choice = sc.nextLine();

        if (choice.equals("1")) {
            System.out.print("Operator ID: "); String id = sc.nextLine();
            System.out.print("Access Code: "); String pass = sc.nextLine();
            if (registeredUser != null && registeredUser.name.equals(id) && registeredUser.password.equals(pass)) {
                loggedIn = true;
                logActivity("User logged in.");
            } else {
                System.out.println("Invalid Credentials.");
            }
        } else if (choice.equals("2")) {
            System.out.print("Full Name: "); String name = sc.nextLine();
            System.out.print("Age: "); int age = Integer.parseInt(sc.nextLine());
            System.out.print("Set Access Code: "); String pass = sc.nextLine();
            registeredUser = new User(name, pass, age);
            System.out.println("Profile Registered.");
        } else if (choice.equals("3")) {
            System.exit(0);
        }
    }

    static void mainMenu() {
        System.out.println("\n--- MAIN MENU (User: " + registeredUser.name.toUpperCase() + ") ---");
        System.out.println("1. Overview (Dashboard)");
        System.out.println("2. Assign Block Protocol");
        System.out.println("3. Terminate Block");
        System.out.println("4. Disconnect (Logout)");
        System.out.print("Choice: ");
        String choice = sc.nextLine();

        switch (choice) {
            case "1": showDashboard(); break;
            case "2": assignBlock(); break;
            case "3": removeBlock(); break;
            case "4": loggedIn = false; logActivity("User logged out."); break;
        }
    }

    static void showDashboard() {
        int totalAttempts = 0, totalTime = 0;
        for (Block b : blocks) { totalAttempts += b.attempts; totalTime += b.duration; }

        System.out.println("\n--- OVERVIEW ---");
        System.out.println("Active Blocks: " + blocks.size() + " | Total Attempts Blocked: " + totalAttempts + " | Time Saved: " + totalTime + "H");
        
        System.out.println("\n[CURRENT RESTRICTIONS]");
        if (blocks.isEmpty()) System.out.println("No active restrictions.");
        for (Block b : blocks) {
            boolean isLocked = System.currentTimeMillis() < b.lockedUntil;
            System.out.println("ID: " + b.id + " | App: " + b.app + " (" + b.url + ") | Goal: " + b.goal + " | Status: " + (isLocked ? "LOCKED (3H Rule)" : "UNLOCKED"));
        }

        System.out.println("\n[RECENT ACTIVITIES]");
        if (activities.isEmpty()) System.out.println("No recent activity.");
        for (String act : activities) {
            System.out.println("- " + act);
        }
    }

    static void assignBlock() {
        System.out.print("\nTarget Application: "); String app = sc.nextLine();
        System.out.print("Profile/Target URL: "); String url = sc.nextLine();
        System.out.print("Primary Goal: "); String goal = sc.nextLine();
        System.out.print("Block Duration (Hours): "); int duration = Integer.parseInt(sc.nextLine());

        blocks.add(new Block(blockCounter++, app, url, goal, duration));
        logActivity("Assigned " + app + " restriction for " + duration + "H. Reason: " + goal);
        System.out.println("RESTRICTION ENFORCED. Unbreakable lock active for 3 hours.");
    }

    static void removeBlock() {
        System.out.print("\nEnter Block ID to terminate: ");
        int id = Integer.parseInt(sc.nextLine());
        
        Block toRemove = null;
        for (Block b : blocks) {
            if (b.id == id) { toRemove = b; break; }
        }

        if (toRemove != null) {
            if (System.currentTimeMillis() < toRemove.lockedUntil) {
                long hoursLeft = (toRemove.lockedUntil - System.currentTimeMillis()) / (1000 * 60 * 60);
                System.out.println("CRITICAL: Cannot override 3-hour initial lock. ~" + hoursLeft + " Hours remaining.");
            } else {
                blocks.remove(toRemove);
                logActivity("Removed restriction protocol for " + toRemove.app);
                System.out.println("Block terminated.");
            }
        } else {
            System.out.println("Block ID not found.");
        }
    }

    static void logActivity(String msg) {
        String time = new java.util.Date().toString();
        activities.addFirst("[" + time + "] " + msg);
        if (activities.size() > 10) activities.removeLast();
    }
}