import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { getCities, getWalker, updateWalker } from "../apiManager";

const initialState = {
  name: "",
  cityIds: [],
};

export default function WalkerEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [formInput, setFormInput] = useState(initialState);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    getCities().then(setCities);
  }, []);

  useEffect(() => {
    getWalker(id).then((w) => {
      setFormInput({
        name: w.name || "",
        cityIds: Array.isArray(w.cityIds) ? w.cityIds : [],
      });
    });
  }, [id]);

  const handleNameChange = (e) => {
    setFormInput((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleCityToggle = (cityId) => {
    setFormInput((prev) => {
      const exists = prev.cityIds.includes(cityId);
      return {
        ...prev,
        cityIds: exists
          ? prev.cityIds.filter((id) => id !== cityId)
          : [...prev.cityIds, cityId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
    name: formInput.name,
    cityIds: formInput.cityIds || [], 
  };

    await updateWalker(id, payload)
    nav("/walkers");
  };

  return (
    <main style={{ padding: "1rem" }}>
      <h2>Edit Walker</h2>
      <p><Link to="/walkers">Back to Walkers</Link></p>

      <Form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formInput.name}
            onChange={handleNameChange}
            required
            placeholder="Walker's name"
          />
        </FormGroup>

        <FormGroup tag="fieldset" className="mt-3">
          <legend className="fs-6">Cities</legend>
          {cities.map((c) => (
            <FormGroup check key={c.id}>
              <Input
                type="checkbox"
                id={`city-${c.id}`}
                checked={formInput.cityIds.includes(c.id)}
                onChange={() => handleCityToggle(c.id)}
              />
              <Label check htmlFor={`city-${c.id}`}>
                {c.name}
              </Label>
            </FormGroup>
          ))}
        </FormGroup>

        <Button color="primary" type="submit" className="mt-3">
          Update Walker
        </Button>
      </Form>
    </main>
  );
}
