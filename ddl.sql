CREATE TABLE public.map_polygon
(
    bd_mgt_sn  varchar                        NULL,
    bdtyp_cd   varchar                        NULL,
    geom       public.geometry(polygon, 5181) NULL,
    properties jsonb                          NULL
);
ALTER TABLE map_polygon
    ADD COLUMN id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY;
CREATE INDEX polygons_geom_gix ON public.map_polygon USING gist (geom);

select count(*)
from map_polygon;

create table public.road_polygon
(
    rn         varchar,
    rn_code    varchar,
    road_bt    real,
    geom       geometry(LineString, 5181),
    properties jsonb
);
ALTER TABLE road_polygon
    ADD COLUMN id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY;
create index road_polygon_geom_gix on public.road_polygon using gist (geom);

select count(*)
from road_polygon;

