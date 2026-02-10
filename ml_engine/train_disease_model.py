
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
import os
import sys

# Configuration
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10
DATASET_DIR = "dataset" # User should put 'train' and 'val' folders here
MODEL_SAVE_PATH = "disease_model.h5"

def train_disease_model():
    print("Checking dataset...")
    if not os.path.exists(DATASET_DIR):
        print(f"Error: Dataset directory '{DATASET_DIR}' not found.")
        print("Please create a 'dataset' folder with 'train' and 'val' subfolders containing class images.")
        return

    # Data Augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest'
    )

    # Data Augmentation (with automatic validation split)
    datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2  # Use 20% of data for validation automatically
    )

    print("Loading data...")
    # Search for the dataset directory containing class folders
    # We look directly in DATASET_DIR, or inside DATASET_DIR/PlantVillage if downloaded directly
    
    # Try finding class folders directly in 'dataset'
    data_dir = DATASET_DIR
    
    # Check if 'PlantVillage' folder exists inside (common Kaggle download structure)
    possible_sub = os.path.join(DATASET_DIR, 'PlantVillage')
    if os.path.exists(possible_sub):
        data_dir = possible_sub

    try:
        train_generator = datagen.flow_from_directory(
            data_dir,
            target_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            class_mode='categorical',
            subset='training' # Set as training data
        )

        validation_generator = datagen.flow_from_directory(
            data_dir,
            target_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            class_mode='categorical',
            subset='validation' # Set as validation data
        )
    except Exception as e:
        print(f"Error loading data: {e}")
        return

    num_classes = train_generator.num_classes
    print(f"Found {num_classes} classes: {list(train_generator.class_indices.keys())}")

    # Transfer Learning with MobileNetV2
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    
    # Freeze base model
    base_model.trainable = False

    # Add custom head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(1024, activation='relu')(x)
    x = Dropout(0.2)(x)
    predictions = Dense(num_classes, activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)

    model.compile(optimizer=Adam(learning_rate=0.0001),
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    # Train
    print("Starting training...")
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // BATCH_SIZE,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // BATCH_SIZE,
        epochs=EPOCHS
    )

    # Save Model
    model.save(MODEL_SAVE_PATH)
    print(f"Model saved to {MODEL_SAVE_PATH}")

    # Start Fine Tuning (Optional - unfreeze some layers)
    # ... (Skipped for simplicity, can be added later)

if __name__ == "__main__":
    train_disease_model()
