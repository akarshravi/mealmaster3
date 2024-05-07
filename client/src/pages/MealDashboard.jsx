import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Mealcounts } from "../utils/data";
import MealCountsCard from "../components/cards/Meal/MealCountsCard";
import MealWeeklyStatCard from "../components/cards/Meal/MealWeeklyStatCard";
import MealCategoryChart from "../components/cards/Meal/MealCategoryChart";
import AddMeal from "../components/AddMeal";
import { addMeal, getMealDashboardDetails, getMeals } from "../api";
import MealCard from "../components/cards/Meal/MealCard";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;
const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;
const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;
const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const MealDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [todaysMeals, setTodaysMeals] = useState([]);
  const [meal, setMeal] = useState(`#Lunch
-Grilled Chicken Sandwich
-consists of grilled chicken, lettuce, tomato, mayonnaise served on a bun.
-400 kcal`);

  const MealdashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    await getMealDashboardDetails(token).then((res) => {
      setData(res.data);
      console.log(res.data);
      setLoading(false);
    });
  };
  const getTodaysMeal = async () => {
    setLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    await getMeals(token, "").then((res) => {
      setTodaysMeals(res?.data?.todaysMeals);
      console.log(res.data);
      setLoading(false);
    });
  };

  const addNewMeal = async () => {
    setButtonLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    await addMeal(token, { MealString: meal })
      .then((res) => {
        MealdashboardData();
        getTodaysMeal();
        setButtonLoading(false);
      })
      .catch((err) =>{
        alert(err.message);
      });
  };

  useEffect(() => {
    MealdashboardData();
    getTodaysMeal();
  }, []);
  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>
        <FlexWrap>
          {Mealcounts.map((item) => (
            <MealCountsCard item={item} data={data} />
          ))}
        </FlexWrap>

        <FlexWrap>
          <MealWeeklyStatCard data={data} />
          <MealCategoryChart data={data} />
          <AddMeal
            meal={meal}
            setMeal={setMeal}
            addNewMeal={addNewMeal}
            buttonLoading={buttonLoading}
          />
        </FlexWrap>

        <Section>
          <Title>Todays Meals</Title>
          <CardWrapper>
            {todaysMeals.map((meal) => (
              <MealCard meal={meal} />
            ))}
          </CardWrapper>
        </Section>
      </Wrapper>
    </Container>
  );
};

export default MealDashboard;
