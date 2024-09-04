using MyApi.Data;
using MyApi.Models;
using MyApi.Utilities;  // for the MatrixFactorization class
using Microsoft.EntityFrameworkCore;

namespace MyApi.Services
{
    public class AdvertisementVectorService
    {
        private readonly AppDbContext _context;

        public AdvertisementVectorService(AppDbContext context)
        {
            _context = context;
        }

        public bool AddAdvertisementVector(AdvertisementVector vector)
        {
            var user = _context.Users
                               .Include(u => u.AdvertisementVectors)
                               .FirstOrDefault(u => u.UserId == vector.UserId);

            if (user == null) return false;

            user.AdvertisementVectors.Add(vector);
            _context.SaveChanges();

            return true;
        }

        public List<Advertisement> GetRecommendedAdvertisements(int userId)
        {
            // Φόρτωση διανυσμάτων διαφημίσεων για τον χρήστη
            var interactionVectors = _context.AdvertisementVectors
                                            .Where(v => v.UserId == userId)
                                            .ToList();

            // Φόρτωση όλων των διαφημίσεων
            var advertisements = _context.Advertisements.ToList();

            // Βεβαιώσου ότι υπάρχουν διανύσματα και διαφημίσεις
            if (interactionVectors.Count < 15 || advertisements.Count == 0)
            {
                return new List<Advertisement>(); // Αν δεν υπάρχουν, επιστρέφουμε κενή λίστα
            }

            int numItems = advertisements.Count;
            double[,] ratings = new double[1, numItems]; // Δημιουργία μήτρας βαθμολογίας για έναν χρήστη
            List<(Advertisement ad, double totalCommonFeatures)> adswithCommonFeatures = new List<(Advertisement, double)>();

            for (int i = 0; i < numItems; i++)
            {
                var ad = advertisements[i];
                double totalCommonFeatures = 0;

                foreach (var vector in interactionVectors)
                {
                    totalCommonFeatures += CalculateCommonFeatures(ad, vector);
                }

                if (totalCommonFeatures == 0) totalCommonFeatures = 0.1; // avoid 0 values

                ratings[0, i] = totalCommonFeatures;
                adswithCommonFeatures.Add((ad, totalCommonFeatures));
            }

            // Κανονικοποίηση των αποτελεσμάτων (0-1)
            double maxScore = ratings.Cast<double>().Max();
            if (maxScore > 0)
            {
                for (int i = 0; i < numItems; i++)
                {
                    ratings[0, i] = ratings[0, i] / maxScore;
                }
            }

            // WriteCommonFeatures(adswithCommonFeatures, ratings, maxScore);

            // Δημιουργία αντικειμένου για το Matrix Factorization
            int numLatentFeatures = 10;
            double learningRate = 0.01;
            double regularization = 0.1;
            int numIterations = 5000;
            var mf = new MatrixFactorization(1, numItems, numLatentFeatures, learningRate, regularization, numIterations);

            // Εκπαίδευση του μοντέλου με χρήση των βαθμολογιών
            mf.Train(ratings);

            // Υπολογισμός των προβλεπόμενων βαθμολογιών
            var predictedRatings = mf.GetPredictedRatings();

            // Επιλογή των διαφημίσεων με τις υψηλότερες προβλεπόμενες βαθμολογίες
            var recommendedAds = advertisements
                .Select((ad, index) => new { Ad = ad, Rating = predictedRatings[0, index] })
                .OrderByDescending(x => x.Rating)
                .Take(30)
                .Select(x => x.Ad)
                .ToList();

            return recommendedAds;
        }

        // Μέθοδος για υπολογισμό των κοινών χαρακτηριστικών
        private double CalculateCommonFeatures(Advertisement ad, AdvertisementVector vector)
        {
            double commonFeatures = 0;

            if ((int)ad.RequiredDegree == vector.RequiredDegree) commonFeatures += 1.0;
            if ((int)ad.RequiredEducationLevel == vector.RequiredEducationLevel) commonFeatures += 1.0;
            if ((int)ad.RequiredPosition == vector.RequiredPosition) commonFeatures += 1.0;
            if ((int)ad.RequiredIndustry == vector.RequiredIndustry) commonFeatures += 1.0;
            if ((int)ad.RequiredJobLevel == vector.RequiredJobLevel) commonFeatures += 1.0;
            if ((int)ad.RequiredSkill == vector.RequiredSkill) commonFeatures += 1.0;
 
            return commonFeatures;
        }

        // Μέθοδος για εμφάνιση των κοινών χαρακτηριστικών
        private void WriteCommonFeatures(List<(Advertisement ad, double totalCommonFeatures)> adswithCommonFeatures, double[,] ratings, double maxScore)
        {
            string filePath = "ads_common_features.txt";
            // Keep the original indices to align with the ratings array
            var indexedAdsWithCommonFeatures = adswithCommonFeatures
                .Select((item, index) => (Advertisement: item.ad, TotalCommonFeatures: item.totalCommonFeatures, Index: index)).ToList()
                .OrderByDescending(x => x.TotalCommonFeatures)
                .ToList();

            using (StreamWriter writer = new StreamWriter(filePath, false))
            {
                writer.WriteLine("Advertisement common featrues and normalized ratings");
                writer.WriteLine("maxScore: " + maxScore);

                foreach (var adWithIndex in indexedAdsWithCommonFeatures )
                {
                    int originalIndex = adWithIndex.Index;
                    writer.WriteLine($"Ad: {adWithIndex.Advertisement.AdvertisementId}, Common Features: {adWithIndex.TotalCommonFeatures}, Normalized Rating: {ratings[0, originalIndex]}");
                }
            }
        }
    }
}
