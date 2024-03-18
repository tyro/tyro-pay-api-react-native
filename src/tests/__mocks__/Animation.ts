global.requestAnimationFrame = jest.fn((callback: (time: number) => void): number => {
  setTimeout(callback, 10);
  return 10;
});
