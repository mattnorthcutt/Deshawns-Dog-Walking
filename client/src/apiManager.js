export const getGreeting = async () => {
  const res = await fetch("/api/hello");
  return res.json();
};

export const getDogs = async () => {
  const res = await fetch("/api/dogs");
  return res.json();
};

export const getADog = async (id) => {
  const res = await fetch(`/api/dogs/${id}`);
  return res.json();
}

export const createDog = async (payload) => {
  const res = await fetch("/api/dogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export const getCities = async () => {
  const res = await fetch("/api/cities");
  return res.json();
}

export const getWalkers = async (cityId) => {
  const url = cityId ? `/api/walkers?cityId=${cityId}` : '/api/walkers';
  const res = await fetch(url);
  return res.json();
};
