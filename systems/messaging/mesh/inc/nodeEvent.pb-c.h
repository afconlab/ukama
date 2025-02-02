/* Generated by the protocol buffer compiler.  DO NOT EDIT! */
/* Generated from: nodeEvent.proto */

#ifndef PROTOBUF_C_nodeEvent_2eproto__INCLUDED
#define PROTOBUF_C_nodeEvent_2eproto__INCLUDED

#include <protobuf-c/protobuf-c.h>

PROTOBUF_C__BEGIN_DECLS

#if PROTOBUF_C_VERSION_NUMBER < 1000000
# error This file was generated by a newer version of protoc-c which is incompatible with your libprotobuf-c headers. Please update your headers.
#elif 1003003 < PROTOBUF_C_MIN_COMPILER_VERSION
# error This file was generated by an older version of protoc-c which is incompatible with your libprotobuf-c headers. Please regenerate this file with a newer version of protoc-c.
#endif


typedef struct _NodeEvent NodeEvent;


/* --- enums --- */


/* --- messages --- */

struct  _NodeEvent
{
  ProtobufCMessage base;
  char *nodeid;
  char *nodeip;
  int32_t nodeport;
  char *meship;
  int32_t meshport;
};
#define NODE_EVENT__INIT \
 { PROTOBUF_C_MESSAGE_INIT (&node_event__descriptor) \
    , NULL, NULL, 0, NULL, 0 }


/* NodeEvent methods */
void   node_event__init
                     (NodeEvent         *message);
size_t node_event__get_packed_size
                     (const NodeEvent   *message);
size_t node_event__pack
                     (const NodeEvent   *message,
                      uint8_t             *out);
size_t node_event__pack_to_buffer
                     (const NodeEvent   *message,
                      ProtobufCBuffer     *buffer);
NodeEvent *
       node_event__unpack
                     (ProtobufCAllocator  *allocator,
                      size_t               len,
                      const uint8_t       *data);
void   node_event__free_unpacked
                     (NodeEvent *message,
                      ProtobufCAllocator *allocator);
/* --- per-message closures --- */

typedef void (*NodeEvent_Closure)
                 (const NodeEvent *message,
                  void *closure_data);

/* --- services --- */


/* --- descriptors --- */

extern const ProtobufCMessageDescriptor node_event__descriptor;

PROTOBUF_C__END_DECLS


#endif  /* PROTOBUF_C_nodeEvent_2eproto__INCLUDED */
