namespace MyApi.Utilities
{
    public class MatrixFactorization
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