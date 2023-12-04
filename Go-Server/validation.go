package main

import (
	"fmt"
	"regexp"
	"strconv"
)

func productAddValidation(request NewProduct) error {
	price, err := strconv.ParseFloat(request.Price, 64)
	if err != nil {
		return fmt.Errorf("invalid price format, must be float")
	}
	quantity, err := strconv.Atoi(request.Quantity)
	if err != nil {
		return fmt.Errorf("invalid quantity format, must be integer")
	}
	if request.Name == "" {
		return fmt.Errorf("product name is required")
	}
	if request.Category == "" {
		return fmt.Errorf("category is required")
	}
	if request.Description == "" {
		return fmt.Errorf("product description is required")
	}
	if len(request.Description) > 255 {
		return fmt.Errorf("product description too long")
	}
	if price < 0 {
		return fmt.Errorf("price cannot be negative")
	}
	if quantity < 0 {
		return fmt.Errorf("quantity cannot be negative")
	}
	format := `^\d+\.\d{2}$` //(x.xx)
	re := regexp.MustCompile(format)
	if !re.MatchString(request.Price) {
		return fmt.Errorf("invalid price format, must have at least one left decimal value and exactly two right decimal values")
	}
	return nil
}

func productUpdateValidation(request Product) error {

	price, err := strconv.ParseFloat(request.Price, 64)
	if err != nil {
		return fmt.Errorf("invalid price format, must be float")
	}

	quantity, err := strconv.Atoi(request.Quantity)
	if err != nil {
		return fmt.Errorf("invalid quantity format, must be integer")
	}

	if request.Name == "" {
		return fmt.Errorf("product name is required")

	}

	if request.Description == "" {
		return fmt.Errorf("product description is required")
	}

	if len(request.Description) > 255 {
		return fmt.Errorf("product description too long")
	}

	if price < 0 {
		return fmt.Errorf("price cannot be negative")
	}

	if quantity < 0 {
		return fmt.Errorf("quantity cannot be negative")
	}

	format := `^\d+\.\d{2}$` //(x.xx)
	re := regexp.MustCompile(format)

	if !re.MatchString(request.Price) {
		return fmt.Errorf("invalid price format, must have at least one left decimal value and exactly two right decimal values")
	}
	return nil
}
