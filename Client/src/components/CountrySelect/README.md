# CountrySelect Component

A beautiful, accessible country picker component with flags, search functionality, and keyboard navigation.

## Features

- 🌍 **195+ Countries** - Comprehensive list with ISO 3166-1 alpha-2 codes
- 🚩 **Country Flags** - High-quality flags from flagcdn.com
- 🔍 **Search Functionality** - Filter countries by name
- ⌨️ **Keyboard Navigation** - Full keyboard support (Arrow keys, Enter, Escape)
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- ♿ **Accessible** - ARIA labels and roles for screen readers
- 🎨 **Beautiful UI** - Modern design with smooth animations
- 🌓 **Dark/Light Mode** - Automatic theme support

## Usage

```jsx
import CountrySelect from "../../components/CountrySelect/CountrySelect";

function MyComponent() {
  const [country, setCountry] = useState("");

  const handleChange = (e) => {
    setCountry(e.target.value);
  };

  return (
    <CountrySelect
      name="country"
      id="country"
      value={country}
      onChange={handleChange}
      label="Select Country"
      placeholder="Choose your country"
      required
    />
  );
}
```

## Props

| Prop          | Type     | Default            | Description                       |
| ------------- | -------- | ------------------ | --------------------------------- |
| `value`       | string   | -                  | Selected country name             |
| `onChange`    | function | -                  | Callback when country is selected |
| `name`        | string   | -                  | Input name attribute              |
| `id`          | string   | -                  | Input id attribute                |
| `label`       | string   | -                  | Label text (optional)             |
| `placeholder` | string   | "Select a country" | Placeholder text                  |
| `required`    | boolean  | false              | Show required asterisk            |
| `className`   | string   | ""                 | Additional CSS classes            |

## Examples

### Basic Usage

```jsx
<CountrySelect
  name="country"
  id="country"
  value={formData.country}
  onChange={handleChange}
  label="Country"
/>
```

### With Required Field

```jsx
<CountrySelect
  name="destinationCountry"
  id="destinationCountry"
  value={state.destinationCountry}
  onChange={handleChange}
  label="Destination Country"
  placeholder="Select destination country"
  required
/>
```

### In a Form

```jsx
<form onSubmit={handleSubmit}>
  <CountrySelect
    name="country"
    id="country"
    value={user.country}
    onChange={handleChange}
    label="Your Country"
    required
  />
  <button type="submit">Submit</button>
</form>
```

## Keyboard Shortcuts

- **Arrow Down** - Navigate to next country
- **Arrow Up** - Navigate to previous country
- **Enter** - Select highlighted country or open dropdown
- **Escape** - Close dropdown
- **Type** - Search for countries

## Styling

The component uses SCSS modules and can be customized by:

1. Overriding CSS classes:

```scss
.country-select {
  // Your custom styles
}
```

2. Using the className prop:

```jsx
<CountrySelect className="my-custom-class" ... />
```

## Data Source

Country flags are loaded from [flagcdn.com](https://flagcdn.com) CDN:

- Standard resolution: `https://flagcdn.com/w40/{code}.png`
- Retina resolution: `https://flagcdn.com/w80/{code}.png`

Country data is stored in `/src/data/countries.js` with ISO 3166-1 alpha-2 codes.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

The component follows WCAG 2.1 Level AA guidelines:

- ARIA roles and labels
- Keyboard navigation
- Focus management
- Screen reader support
- High contrast mode support

## Performance

- Lazy loading of flag images
- Efficient search filtering
- Optimized re-renders with React hooks
- Smooth animations with Framer Motion

## License

Part of the LuggageShare application.
