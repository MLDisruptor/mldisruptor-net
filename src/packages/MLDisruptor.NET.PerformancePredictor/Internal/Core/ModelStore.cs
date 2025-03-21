﻿using Microsoft.ML;

namespace MLDisruptor.NET.PerformancePredictor.Internal.Core
{
    internal class ModelStore
    {
        private volatile ITransformer _model;

        private ModelStore()
        {
        }

        public static ModelStore Create()
        {
            var holder = new ModelStore();
            return holder;
        }

        public ITransformer GetModel()
        {
            return _model;
        }

        public void UpdateModel(ITransformer newModel)
        {
            if (newModel == null)
            {
                Console.WriteLine("New Model is null");
                return;
            }
            Interlocked.Exchange(ref _model, newModel);
        }
    }
}
