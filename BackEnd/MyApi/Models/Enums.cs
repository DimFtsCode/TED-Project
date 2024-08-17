namespace MyApi.Models.Enums
{
    public enum EducationLevel
    {
        HighSchool,
        Bachelor,
        Master,
        Doctorate
    }

    public enum Degree
    {
        ComputerScience,      // Πληροφορική
        BusinessAdministration, // Διοίκηση Επιχειρήσεων
        MechanicalEngineering, // Μηχανολογία
        ElectricalEngineering, // Ηλεκτρολογία
        CivilEngineering,     // Πολιτική Μηχανική
        Medicine,             // Ιατρική
        Law,                  // Νομική
        Psychology,           // Ψυχολογία
        Education,            // Παιδαγωγική
        Economics,             // Οικονομικά
        NoDegree
    }

    public enum JobIndustry
    {
        Technology,    // Τεχνολογία
        Healthcare,    // Υγεία
        Energy,        // Ενέργεια
        Transportation,// Μεταφορές
        Education,     // Εκπαίδευση
        Creative,      // Δημιουργία
        Legal          // Νομική
    }

    public enum JobLevel
    {
        Internship,   // Πρακτική Άσκηση
        Junior,       // Junior Επίπεδο
        MidLevel,     // Mid Επίπεδο
        Senior,       // Senior Επίπεδο
        Lead,         // Lead Επίπεδο
        Manager,      // Manager Επίπεδο
        Director,     // Director Επίπεδο
        Executive     // Executive Επίπεδο
    }

    

    public enum JobPosition
    {
        // Τεχνολογία
        SoftwareEngineer,      // Μηχανικός Λογισμικού
        DataScientist,         // Επιστήμονας Δεδομένων
        ITManager,             // Διευθυντής Πληροφορικής
        CyberSecurityAnalyst,  // Αναλυτής Κυβερνοασφάλειας

        // Υγεία
        Nurse,                 // Νοσηλευτής
        Pharmacist,            // Φαρμακοποιός
        MedicalTechnician,     // Ιατρικός Τεχνικός
        HealthcareAdministrator, // Διαχειριστής Υγειονομικής Περίθαλψης

        // Ενέργεια
        EnergyConsultant,      // Σύμβουλος Ενέργειας
        RenewableEnergyEngineer, // Μηχανικός Ανανεώσιμων Πηγών Ενέργειας

        // Μεταφορές
        LogisticsManager,      // Διευθυντής Λογιστικής Αλυσίδας
        TransportationEngineer, // Μηχανικός Μεταφορών
        SupplyChainAnalyst,    // Αναλυτής Αλυσίδας Εφοδιασμού

        // Εκπαίδευση
        Teacher,               // Δάσκαλος
        AcademicCounselor,     // Ακαδημαϊκός Σύμβουλος

        // Δημιουργία
        GraphicDesigner,       // Γραφίστας
        ContentCreator,        // Δημιουργός Περιεχομένου
        MarketingSpecialist,   // Ειδικός Μάρκετινγκ

        // Νομική
        Lawyer,                // Δικηγόρος
        LegalAssistant         // Νομικός Βοηθός
    }

    public enum SkillCategory
    {
        Technical,       // Τεχνικές δεξιότητες (π.χ., προγραμματισμός, ανάλυση δεδομένων)
        Language,        // Γλωσσικές δεξιότητες (π.χ., γνώση ξένων γλωσσών)
        Communication,   // Επικοινωνιακές δεξιότητες
        Leadership       // Ηγετικές ικανότητες
    }
}