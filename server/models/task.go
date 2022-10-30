package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DBTask struct {
	ID         	primitive.ObjectID 	`bson:"_id"`
	Subject    	*string            	`json:"subject,omitempty"`
	Done	   	*bool           	`json:"done,omitempty"`
}
