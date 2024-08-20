using MyApi.Data;
using MyApi.Models;
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
                               .Include(u => u.InteractionVectors)
                               .FirstOrDefault(u => u.UserId == vector.UserId);

            if (user == null) return false;

            user.InteractionVectors.Add(vector);
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

            for (int i = 0; i < numItems; i++)
            {
                var ad = advertisements[i];
                double totalCommonFeatures = 0;

                foreach (var vector in interactionVectors)
                {
                    totalCommonFeatures += CalculateCommonFeatures(ad, vector);
                }

                ratings[0, i] = totalCommonFeatures;
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
                .Take(15)
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


        // Κλάση για την εκτέλεση του Matrix Factorization
        private class MatrixFactorization
        {
            private int numUsers;
            private int numItems;
            private int numLatentFeatures;
            private double learningRate;
            private double regularization;
            private int numIterations;

            private double[,] userMatrix;
            private double[,] itemMatrix;

            public MatrixFactorization(int numUsers, int numItems, int numLatentFeatures, double learningRate, double regularization, int numIterations)
            {
                this.numUsers = numUsers;
                this.numItems = numItems;
                this.numLatentFeatures = numLatentFeatures;
                this.learningRate = learningRate;
                this.regularization = regularization;
                this.numIterations = numIterations;

                this.userMatrix = InitializeMatrix(numUsers, numLatentFeatures);
                this.itemMatrix = InitializeMatrix(numLatentFeatures, numItems);
            }

            private double[,] InitializeMatrix(int rows, int cols)
            {
                var random = new Random();
                var matrix = new double[rows, cols];

                for (int i = 0; i < rows; i++)
                {
                    for (int j = 0; j < cols; j++)
                    {
                        matrix[i, j] = random.NextDouble();
                    }
                }

                return matrix;
            }

            public void Train(double[,] ratings)
            {
                for (int iteration = 0; iteration < numIterations; iteration++)
                {
                    for (int i = 0; i < numUsers; i++)
                    {
                        for (int j = 0; j < numItems; j++)
                        {
                            if (ratings[i, j] > 0)
                            {
                                double error = ratings[i, j] - PredictRating(i, j);

                                for (int k = 0; k < numLatentFeatures; k++)
                                {
                                    userMatrix[i, k] += learningRate * (2 * error * itemMatrix[k, j] - regularization * userMatrix[i, k]);
                                    itemMatrix[k, j] += learningRate * (2 * error * userMatrix[i, k] - regularization * itemMatrix[k, j]);
                                }
                            }
                        }
                    }
                }
            }

            public double PredictRating(int userId, int itemId)
            {
                double prediction = 0.0;

                for (int k = 0; k < numLatentFeatures; k++)
                {
                    prediction += userMatrix[userId, k] * itemMatrix[k, itemId];
                }

                return prediction;
            }

            public double[,] GetPredictedRatings()
            {
                double[,] predictedRatings = new double[numUsers, numItems];

                for (int i = 0; i < numUsers; i++)
                {
                    for (int j = 0; j < numItems; j++)
                    {
                        predictedRatings[i, j] = PredictRating(i, j);
                    }
                }

                return predictedRatings;
            }
        }
    }
}
