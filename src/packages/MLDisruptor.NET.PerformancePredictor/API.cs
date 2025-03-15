namespace MLDisruptor.NET.PerformancePredictor
{
    /// <summary>
    /// Represents a provider that supplies data of type <typeparamref name="T"/>.
    /// </summary>
    /// <typeparam name="T">The type of data provided.</typeparam>
    public interface IDataProvider<out T>
    {
        /// <summary>
        /// Retrieves the data.
        /// </summary>
        /// <returns>The data of type <typeparamref name="T"/>.</returns>
        T GetData();
    }

    /// <summary>
    /// Defines a builder for creating training data of type <typeparamref name="TTrainingData"/>.
    /// </summary>
    /// <typeparam name="TTrainingData">The type of training data to be built.</typeparam>
    /// <typeparam name="TConfiguration">The type of configuration data used to build the training data.</typeparam>
    public interface ITrainingDataBuilder<TTrainingData, in TConfiguration>
        where TTrainingData : class
    {
        /// <summary>
        /// Builds the training data using the provided data provider.
        /// </summary>
        /// <param name="dataProvider">The data provider that supplies the configuration data of type <typeparamref name="TConfiguration"/>.</param>
        /// <returns>The built training data of type <typeparamref name="TTrainingData"/>.</returns>
        TTrainingData Build(IDataProvider<TConfiguration> dataProvider);
    }

    /// <summary>
    /// Represents a predictor that predicts the performance of a given event of type <typeparamref name="TEvent"/>.
    /// </summary>
    /// <typeparam name="TEvent">The type of event for which the performance is predicted. This could be any event that impacts performance metrics.</typeparam>
    public interface IExecutionPerformancePredictor<in TEvent>
    {
        /// <summary>
        /// Initiates the performance prediction process for a given sequence.
        /// </summary>
        /// <param name="sequence">The sequence number to start the prediction for.</param>
        void Start(long sequence);

        /// <summary>
        /// Completes the performance prediction process for a given event and message type.
        /// </summary>
        /// <param name="event">The event to finish the prediction for.</param>
        /// <param name="messageType">The type of the message associated with the event.</param>
        /// <returns>The predicted performance as a float value.</returns>
        float Finish(TEvent @event, int messageType);
    }

    /// <summary>
    /// Represents a trainer that trains a model using the provided training input data of type <typeparamref name="TTrainingInput"/>.
    /// </summary>
    /// <typeparam name="TTrainingInput">The type of training input data.</typeparam>
    public interface ITrainer<in TTrainingInput>
    {
        /// <summary>
        /// Trains a model using the provided training input data.
        /// </summary>
        /// <param name="data">The training input data of type <typeparamref name="TTrainingInput"/> used to train the model.</param>
        void Train(TTrainingInput data);
    }

    /// <summary>
    /// Represents a model trainer that trains a model using the provided training input data of type <typeparamref name="TTrainingInput"/>.
    /// </summary>
    /// <typeparam name="TTrainingInput">The type of training input data.</typeparam>
    public interface IModelTrainer<in TTrainingInput>
    {
        /// <summary>
        /// Trains a model using the provided training input data.
        /// </summary>
        /// <param name="data">The training input data of type <typeparamref name="TTrainingInput"/> used to train the model.</param>
        void Train(TTrainingInput data);
    }

    /// <summary>
    /// Represents a factory that creates a trainer of type <see cref="ITrainer{TInput}"/>.
    /// </summary>
    /// <typeparam name="TTrainingInput">The type of training input data.</typeparam>
    public interface ITrainerFactory<in TTrainingInput>
    {
        /// <summary>
        /// Creates a trainer of type <see cref="ITrainer{TInput}"/>.
        /// </summary>
        /// <returns>The trainer instance of type <see cref="ITrainer{TInput}"/>.</returns>
        ITrainer<TTrainingInput> CreateTrainer();
    }

    /// <summary>
    /// Represents a prediction engine that makes predictions based on the provided input data of type <typeparamref name="TInput"/>.
    /// </summary>
    /// <typeparam name="TInput">The type of input data used for making predictions.</typeparam>
    public interface IPredictionEngine<in TInput>
    {
        /// <summary>
        /// Predicts a value based on the provided input data.
        /// </summary>
        /// <param name="data">The input data of type <typeparamref name="TInput"/> used for making the prediction.</param>
        /// <returns>The predicted value as a float.</returns>
        float Predict(TInput data);
    }

    /// <summary>
    /// Represents a predictor that makes predictions based on the provided input data of type <typeparamref name="TInput"/>.
    /// </summary>
    /// <typeparam name="TInput">The type of input data used for making predictions.</typeparam>
    public interface IPredictor<in TInput>
    {
        /// <summary>
        /// Makes a prediction based on the provided input data and type.
        /// </summary>
        /// <param name="data">The input data of type <typeparamref name="TInput"/> used for making the prediction.</param>
        /// <param name="type">The type associated with the input data.</param>
        /// <returns>The predicted value as a float.</returns>
        float MakePrediction(TInput data, int type);
    }

    /// <summary>
    /// Represents a factory that creates instances of <see cref="IPredictor{TInput}"/>.
    /// </summary>
    /// <typeparam name="TInput">The type of input data used by the predictor.</typeparam>
    public interface IPredictorFactory<in TInput>
    {
        /// <summary>
        /// Creates an instance of <see cref="IPredictor{TInput}"/> to make predictions based on the provided input data.
        /// </summary>
        /// <returns>An instance of <see cref="IPredictor{TInput}"/>.</returns>
        IPredictor<TInput> CreatePredictor();
    }
}
