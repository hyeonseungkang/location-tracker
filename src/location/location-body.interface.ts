import { Feature } from 'geojson';

export interface LocationBody {
  current: Feature;
  locations: Feature[];
}
