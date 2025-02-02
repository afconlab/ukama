/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present, Ukama Inc.
 */

/*
 * utilies functions
 */

#ifndef LXCE_UTILS_H
#define LXCE_UTILS_H

#define PARENT_SOCKET 0
#define CHILD_SOCKET  1

#define TRUE  1
#define FALSE 0

int set_integer_object_value(json_t *json, int *param, char *objName,
			     int mandatory, int defValue);
int set_str_object_value(json_t *json, char **param, char *objName,
			 int mandatory, char *defValue);
int namespaces_flag(char *ns);
int str_to_cap(const char *str);

#endif /* LXCE_UTILS_H */
