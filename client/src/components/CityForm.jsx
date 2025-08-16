import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { createCity } from "../apiManager";

const initialState = {
  name: ""
}

export default function CityForm() {
  const [formInput, setFormInput] = useState(initialState);
  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { name: formInput.name };
    const created = await createCity(payload);
    nav(`/cities`);
  };

  return (
    <main style={{ padding: "1rem" }}>
      <h2>Add City</h2>
      <p><Link to="/cities">Back to Cities</Link></p>

      <Form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
        <FormGroup>
          <Label for="name">City Name</Label>
          <Input
            id="name"
            name="name"
            value={formInput.name}
            onChange={handleChange}
            required
            placeholder="City Name"
          />
        </FormGroup>

        <Button color="primary" type="submit">
          Add/Submit
        </Button>
      </Form>
    </main>
  );
}
