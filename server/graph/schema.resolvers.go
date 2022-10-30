package graph

import (
	"context"
	"fmt"
	"server/graph/generated"
	"server/graph/model"
	"time"


	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/bson"
	models "server/models"
)


var taskCollection *mongo.Collection = models.OpenCollection(models.Client, "tasks")

// CreateTask is the resolver for the createTask field.
func (r *mutationResolver) CreateTask(ctx context.Context, input model.NewTask) (bool, error) {
	var dbCtx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	dbTask := models.DBTask{
		ID: primitive.NewObjectID(),
		Subject: &input.Subject,
		Done: &input.Done, 
	}

	_, insertErr := taskCollection.InsertOne(dbCtx, dbTask)
	if insertErr != nil {
		fmt.Println(insertErr)
		defer cancel()

		return false, insertErr
	}
	defer cancel()

	return true, nil
}

// UpdateTask is the resolver for the updateTask field.
func (r *mutationResolver) UpdateTask(ctx context.Context, input model.UpdateTask) (bool, error) {
	taskID := input.ID
	docID, _ := primitive.ObjectIDFromHex(taskID)

	var dbCtx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	_, err := taskCollection.ReplaceOne(
		dbCtx,
		bson.M{"_id": docID},
		bson.M{
			"subject":  &input.Subject,
			"done": &input.Done,
		},
	)

	if err != nil {
		fmt.Println(err)

		defer cancel()

		return false, err
	}

	defer cancel()

	return true, nil

}

// DeleteTask is the resolver for the deleteTask field.
func (r *mutationResolver) DeleteTask(ctx context.Context, input model.DeleteTask) (bool, error) {
	taskID := input.ID
	docID, _ := primitive.ObjectIDFromHex(taskID)

	var dbCtx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	_, err := taskCollection.DeleteOne(dbCtx, bson.M{"_id": docID})
	
	if err != nil {
		fmt.Println(err)
		
		defer cancel()

		return false, err
	}

	defer cancel()

	return true, nil
}

// Tasks is the resolver for the tasks field.
func (r *queryResolver) Tasks(ctx context.Context) ([]*model.Task, error) {
	var dbCtx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	
	var tasksDB []bson.M

	cursor, err := taskCollection.Find(dbCtx, bson.M{})

	if err != nil {
		fmt.Println(err)

		defer cancel()

		return nil, err
	}
	
	if err = cursor.All(dbCtx, &tasksDB); err != nil {
		fmt.Println(err)

		defer cancel()

		return nil, err
	}

	defer cancel()

	responseTasks := []*model.Task{}

	for _, task := range tasksDB {
		bsonBytes, _ := bson.Marshal(task)
		respTmp := &model.Task{}
		dbTmp := &models.DBTask{}
		bson.Unmarshal(bsonBytes, dbTmp)
		respTmp.ID = dbTmp.ID.Hex()
		respTmp.Subject = *dbTmp.Subject
		respTmp.Done = *dbTmp.Done
		responseTasks = append(responseTasks, respTmp)
		
	}
	return responseTasks, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
