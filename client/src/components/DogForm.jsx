import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createDog } from "../apiManager";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";

const initialState = {
  name: "",
  cityId: "",
  walkerId: "",
};

export default function DogForm() {
  const [formInput, setFormInput] = useState(initialState);
  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formInput.name,
      cityId: Number(formInput.cityId),
      walkerId: formInput.walkerId ? Number(formInput.walkerId) : null,
    };

    const created = await createDog(payload);
    nav(`/dogs/${created.id}`);
  }

  return (
    <main style={{ padding: "1rem" }}>
      <h2>Add Dog</h2>
      <p><Link to="/">Back Home</Link></p>

      <Form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formInput.name}
            onChange={handleChange}
            required
            placeholder="Name"
          />
        </FormGroup>

        <FormGroup>
          <Label for="cityId">City Id (required)</Label>
          <Input
            id="cityId"
            name="cityId"
            type="number"
            min="1"
            value={formInput.cityId}
            onChange={handleChange}
            required
            placeholder="Number (1,2,3, etc.)"
          />
        </FormGroup>

        <FormGroup>
          <Label for="walkerId">Walker Id</Label>
          <Input
            id="walkerId"
            name="walkerId"
            type="number"
            min="1"
            value={formInput.walkerId}
            onChange={handleChange}
            placeholder="Number (1,2,3, etc.)"
          />
        </FormGroup>

        <Button color="primary" type="submit">
          Add/Submit
        </Button>
      </Form>
    </main>
  );
}
