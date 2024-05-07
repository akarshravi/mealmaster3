import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const AddMeal = ({ meal, setMeal, addNewMeal, buttonLoading }) => {
  return (
    <Card>
      <Title>Add New Meal</Title>
      <TextInput
        label="Meal"
        textArea
        rows={10}
        placeholder={`Enter in this format:

#Category
-Meal Name
-description
-Calories
`}
        value={meal}
        handelChange={(e) => setMeal(e.target.value)}
      />
      <Button
        text="Add Meal"
        small
        onClick={() => addNewMeal()}
        isLoading={buttonLoading}
        isDisabled={buttonLoading}
      />
    </Card>
  );
};

export default AddMeal;
